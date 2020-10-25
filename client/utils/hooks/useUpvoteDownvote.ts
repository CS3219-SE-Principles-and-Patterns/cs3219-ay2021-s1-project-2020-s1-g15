import { useAuth } from "components/authentication";
import { useState, useEffect } from "react";
import { Question, VoteStatus, VoteCommand } from "utils";

type VoteHookProp = {
  upvotes: number;
  downvotes: number;
  qid: string;
  checkVoteStatus: (
    userIdToken: string,
    questionId: string
  ) => Promise<VoteStatus>;
  upvoteAPIRequest: (
    userIdToken: string,
    questionId: string,
    voteCmd: VoteCommand
  ) => Promise<Question>;
  downvoteAPIRequest: (
    userIdToken: string,
    questionId: string,
    voteCmd: VoteCommand
  ) => Promise<Question>;
};

function useUpvoteDownvote({
  upvotes,
  downvotes,
  qid,
  checkVoteStatus,
  upvoteAPIRequest,
  downvoteAPIRequest,
}: VoteHookProp) {
  const { isAuthenticated, getIdToken } = useAuth();
  const [idToken, setIdToken] = useState<string | undefined>(undefined);
  const [upvotesLocal, setUpvotes] = useState<number>(upvotes);
  const [downvotesLocal, setDownvotes] = useState<number>(downvotes);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);
  const [hasDownvoted, setHasDownvoted] = useState<boolean>(false);

  useEffect(() => {
    const runChecks = async () => {
      const userIdToken = await getIdToken();

      const { isUpvote, isDownvote } = await checkVoteStatus(userIdToken, qid);
      if (isUpvote) {
        setHasUpvoted(true);
      }

      if (isDownvote) {
        setHasDownvoted(true);
      }
      setIdToken(userIdToken);
    };
    if (isAuthenticated) {
      runChecks();
    }
  }, [checkVoteStatus, getIdToken, isAuthenticated, qid]);

  const upvoteOnClick = async () => {
    if (hasUpvoted && idToken) {
      const question = await upvoteAPIRequest(idToken, qid, VoteCommand.REMOVE);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpvoted(false);
      setHasDownvoted(false);
    } else if (idToken) {
      const question = await upvoteAPIRequest(idToken, qid, VoteCommand.INSERT);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpvoted(true);
      setHasDownvoted(false);
    }
  };
  const downvoteOnClick = async () => {
    if (hasDownvoted && idToken) {
      const question = await downvoteAPIRequest(
        idToken,
        qid,
        VoteCommand.REMOVE
      );
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpvoted(false);
      setHasDownvoted(false);
    } else if (idToken) {
      const question = await downvoteAPIRequest(
        idToken,
        qid,
        VoteCommand.INSERT
      );
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpvoted(false);
      setHasDownvoted(true);
    }
  };
  // might not need to import all, but just left it so there is a flexibility
  return {
    idToken,
    upvotesLocal,
    setUpvotes,
    downvotesLocal,
    setDownvotes,
    hasUpvoted,
    setHasUpvoted,
    hasDownvoted,
    setHasDownvoted,
    upvoteOnClick,
    downvoteOnClick,
  };
}
export { useUpvoteDownvote };
