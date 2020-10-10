import { ObjectId } from "mongodb";

import { Util } from "./Util";

export interface User extends Util {
  email: string;
  username: string;
  answerIds: ObjectId[];
  questionIds: ObjectId[];
}
