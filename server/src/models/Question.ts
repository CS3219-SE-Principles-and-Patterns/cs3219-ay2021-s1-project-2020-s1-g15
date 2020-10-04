import { ObjectId } from "mongodb";

import { Util } from "./Util";

export interface Question extends Util {
  title: string;
  slug: string;
  markdown: string;
  answer_ids: ObjectId[];
  user_id: ObjectId;
  level: string;
  subject: string;
  upvotes: number;
  downvotes: number;
}
