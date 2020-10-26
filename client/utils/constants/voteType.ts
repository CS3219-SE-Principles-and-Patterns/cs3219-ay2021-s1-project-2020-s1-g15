export enum VoteCommand {
  INSERT = "insert",
  REMOVE = "remove",
}
export interface VoteStatus {
  isUpvote: boolean;
  isDownvote: boolean;
}
