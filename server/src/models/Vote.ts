import { ObjectId } from "mongodb";

import { Util } from "./Util";
import { VoteType } from "../utils/constants";

interface Upvote {
  value: VoteType.UPVOTE;
}

interface Downvote {
  value: VoteType.DOWNVOTE;
}

interface BaseVote extends Util {
  userId: ObjectId;
  type: Upvote | Downvote;
}

interface AnswerVote extends BaseVote {
  answerId: ObjectId;
  questionId?: never;
}

interface QuestionVote extends BaseVote {
  questionId: ObjectId;
  answerId?: never;
}

export type Vote = AnswerVote | QuestionVote;
