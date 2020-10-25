import { useAuth } from "components/authentication";
import { useState, useEffect } from "react";

import {
  VoteCommand,
  checkQuestionVoteStatus,
  upvoteQuestion,
  downvoteQuestion,
  checkAnswerVoteStatus,
} from "utils";
import { upvoteAnswer, downvoteAnswer } from "utils/api";

type BaseVoteHookProps = {
  upvotes: number;
  downvotes: number;
};

type QuestionVoteHookProps = BaseVoteHookProps & {
  isAnswerVote?: never;
  isQuestionVote: true;
  answerId?: never;
  questionId: string;
};

type AnswerVoteHookProps = BaseVoteHookProps & {
  isQuestionVote?: never;
  isAnswerVote: true;
  questionId?: never;
  answerId: string;
};

function useUpvoteDownvote({
  upvotes,
  downvotes,
  isQuestionVote,
  questionId,
  answerId,
}: QuestionVoteHookProps | AnswerVoteHookProps) {
  const { isAuthenticated, idToken } = useAuth();
  const [upvotesLocal, setUpvotes] = useState<number>(upvotes);
  const [downvotesLocal, setDownvotes] = useState<number>(downvotes);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);
  const [hasDownvoted, setHasDownvoted] = useState<boolean>(false);

  useEffect(() => {
    const runChecks = async () => {
      const { isUpvote, isDownvote } = isQuestionVote
        ? await checkQuestionVoteStatus(idToken, questionId as string)
        : await checkAnswerVoteStatus(idToken, answerId as string);
      setHasUpvoted(isUpvote);
      setHasDownvoted(isDownvote);
    };

    if (isAuthenticated) {
      runChecks();
    }
  }, [idToken, isAuthenticated, isQuestionVote, questionId, answerId]);

  const upvoteOnClick = async () => {
    if (!isAuthenticated) {
      return;
    }

    const voteCommand = hasUpvoted ? VoteCommand.REMOVE : VoteCommand.INSERT;
    const doc = isQuestionVote
      ? await upvoteQuestion(idToken, questionId as string, voteCommand)
      : await upvoteAnswer(idToken, answerId as string, voteCommand);
    setUpvotes(doc.upvotes);
    setDownvotes(doc.downvotes);
    setHasUpvoted(!hasUpvoted);
    setHasDownvoted(false);
  };

  const downvoteOnClick = async () => {
    if (!isAuthenticated) {
      return;
    }

    const voteCommand = hasDownvoted ? VoteCommand.REMOVE : VoteCommand.INSERT;
    const doc = isQuestionVote
      ? await downvoteQuestion(idToken, questionId as string, voteCommand)
      : await downvoteAnswer(idToken, answerId as string, voteCommand);
    setUpvotes(doc.upvotes);
    setDownvotes(doc.downvotes);
    setHasDownvoted(!hasDownvoted);
    setHasUpvoted(false);
  };

  // might not need to import all, but just left it so there is a flexibility
  return {
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
