import { ObjectId } from "mongodb";

import { Util } from "./Util";
import { VoteType } from "../utils/constants";

interface BaseVote extends Util {
  userId: ObjectId;
  type: VoteType;
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
