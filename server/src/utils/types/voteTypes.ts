// API REQUEST RESPONSE //

export type GetVoteStatusResponse = {
  isUpvote: boolean;
  isDownvote: boolean;
};

// UTILS //

export type VoteIncrementObject = {
  upvotes: -1 | 0 | 1;
  downvotes: -1 | 0 | 1;
};
