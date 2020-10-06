import { ObjectId } from "mongodb";

import { Util } from "./Util";

export interface Answer extends Util {
  markdown: string;
  question_id: ObjectId;
  user_id: ObjectId;
  upvotes: number;
  downvotes: number;
}
