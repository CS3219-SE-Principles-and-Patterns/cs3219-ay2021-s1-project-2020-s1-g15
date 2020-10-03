import { ObjectId } from "mongodb";

export interface User {
  email: string;
  username: string;
  answer_ids: ObjectId[];
  question_ids: ObjectId[];
}
