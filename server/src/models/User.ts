import { ObjectId } from "mongodb";

export interface User {
  email: string;
  username: string;
  answerIds: ObjectId[];
  questionIds: ObjectId[];
}
