import { ObjectId } from "mongodb";

import { Util } from "./Util";

interface BaseVote extends Util {
  userId: ObjectId;
  type: 1 | -1;
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
