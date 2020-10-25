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
  questionId: string;
};

type AnswerVoteHookProps = BaseVoteHookProps & {
  isQuestionVote?: never;
  isAnswerVote: true;
  answerId: string;
};

function useUpvoteDownvote(props: QuestionVoteHookProps | AnswerVoteHookProps) {
  const { upvotes, downvotes } = props;

  const { isAuthenticated, getIdToken } = useAuth();
  const [upvotesLocal, setUpvotes] = useState<number>(upvotes);
  const [downvotesLocal, setDownvotes] = useState<number>(downvotes);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false);
  const [hasDownvoted, setHasDownvoted] = useState<boolean>(false);

  useEffect(() => {
    const runChecks = async () => {
      const { isUpvote, isDownvote } = props.isQuestionVote
        ? await checkQuestionVoteStatus(props.questionId)
        : await checkAnswerVoteStatus(props.answerId);

      setHasUpvoted(isUpvote);
      setHasDownvoted(isDownvote);
    };

    if (isAuthenticated) {
      runChecks();
    }
  }, [getIdToken, isAuthenticated, props]);

  const upvoteOnClick = async () => {
    if (!isAuthenticated) {
      return;
    }

    const voteCommand = hasUpvoted ? VoteCommand.REMOVE : VoteCommand.INSERT;
    const doc = props.isQuestionVote
      ? await upvoteQuestion(props.questionId, voteCommand)
      : await upvoteAnswer(props.answerId, voteCommand);
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
    const doc = props.isQuestionVote
      ? await downvoteQuestion(props.questionId, voteCommand)
      : await downvoteAnswer(props.answerId, voteCommand);
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
