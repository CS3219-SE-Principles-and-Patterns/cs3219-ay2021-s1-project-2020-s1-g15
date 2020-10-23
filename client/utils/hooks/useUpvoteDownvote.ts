import { useAuth } from "components/authentication";
import { useState, useEffect } from "react";
import { Question, UpvoteDownvoteStatus, VOTE_CMD } from "utils";

type VoteHookProp = {
  upvotes: number;
  downvotes: number;
  qid: string;
  checkVoteStatus: (
    userIdToken: string,
    questionId: string
  ) => Promise<UpvoteDownvoteStatus>;
  upvoteAPIRequest: (
    userIdToken: string,
    questionId: string,
    voteCmd: VOTE_CMD
  ) => Promise<Question>;
  downvoteAPIRequest: (
    userIdToken: string,
    questionId: string,
    voteCmd: VOTE_CMD
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
  const [hasUpVoted, setHasUpVoted] = useState<boolean>(false);
  const [hasDownVoted, setHasDownVoted] = useState<boolean>(false);

  useEffect(() => {
    const runChecks = async () => {
      const userIdToken = await getIdToken();

      const { isUpvote, isDownvote } = await checkVoteStatus(userIdToken, qid);
      if (isUpvote) {
        setHasUpVoted(true);
      }

      if (isDownvote) {
        setHasDownVoted(true);
      }
      setIdToken(userIdToken);
    };
    if (isAuthenticated) {
      runChecks();
    }
  }, [checkVoteStatus, getIdToken, isAuthenticated, qid]);

  const upvoteOnClick = async () => {
    if (hasUpVoted && idToken) {
      const question = await upvoteAPIRequest(idToken, qid, VOTE_CMD.remove);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpVoted(false);
      setHasDownVoted(false);
    } else if (idToken) {
      const question = await upvoteAPIRequest(idToken, qid, VOTE_CMD.insert);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpVoted(true);
      setHasDownVoted(false);
    }
  };
  const downvoteOnClick = async () => {
    if (hasDownVoted && idToken) {
      const question = await downvoteAPIRequest(idToken, qid, VOTE_CMD.remove);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpVoted(false);
      setHasDownVoted(false);
    } else if (idToken) {
      const question = await downvoteAPIRequest(idToken, qid, VOTE_CMD.insert);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpVoted(false);
      setHasDownVoted(true);
    }
  };
  // might not need to import all, but just left it so there is a flexibility
  return {
    idToken,
    upvotesLocal,
    setUpvotes,
    downvotesLocal,
    setDownvotes,
    hasUpVoted,
    setHasUpVoted,
    hasDownVoted,
    setHasDownVoted,
    upvoteOnClick,
    downvoteOnClick,
  };
}
export { useUpvoteDownvote };
