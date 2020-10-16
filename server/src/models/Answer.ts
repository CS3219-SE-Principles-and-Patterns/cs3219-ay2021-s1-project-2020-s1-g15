import { ObjectId } from "mongodb";

import { Util } from "./Util";

export interface Answer extends Util {
  markdown: string;
  questionId: ObjectId;
  upvotes: number;
  downvotes: number;
}
