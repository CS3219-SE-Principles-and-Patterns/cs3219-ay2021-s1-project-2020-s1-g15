import { ObjectId } from "mongodb";

import { VoteType } from "../utils";
import { Util } from "./Util";

interface BaseVote extends Util {
  userId: ObjectId;
  type: VoteType.UPVOTE | VoteType.DOWNVOTE;
}

export interface AnswerVote extends BaseVote {
  answerId: ObjectId;
  questionId?: never;
}

export interface QuestionVote extends BaseVote {
  questionId: ObjectId;
  answerId?: never;
}

export type Vote = AnswerVote | QuestionVote;
