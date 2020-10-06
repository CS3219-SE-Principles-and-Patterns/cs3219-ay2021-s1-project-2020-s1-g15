import { ObjectId } from "mongodb";

import { Util } from "./Util";
import { VoteType } from "../utils/constants";

interface BaseVote extends Util {
  user_id: ObjectId;
  type: VoteType;
}

interface AnswerVote extends BaseVote {
  answer_id: ObjectId;
  question_id?: never;
}

interface QuestionVote extends BaseVote {
  question_id: ObjectId;
  answer_id?: never;
}

export type Vote = AnswerVote | QuestionVote;
