export enum VOTE_CMD {
  insert = "insert",
  remove = "remove",
}
export interface UpvoteDownvoteStatus {
  isUpvote: boolean;
  isDownvote: boolean;
}
