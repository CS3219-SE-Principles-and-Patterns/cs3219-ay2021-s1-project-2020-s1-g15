// API REQUEST RESPONSE //

type BaseVoteStatusResponse = {
  isUpvote: boolean;
  isDownvote: boolean;
};

export type GetQuestionVoteStatusResponse = BaseVoteStatusResponse;

export type GetAnswersVoteStatusResponse = {
  [answerId: string]: BaseVoteStatusResponse;
};

// UTILS //

export type VoteIncrementObject = {
  upvotes: -1 | 0 | 1;
  downvotes: -1 | 0 | 1;
};
