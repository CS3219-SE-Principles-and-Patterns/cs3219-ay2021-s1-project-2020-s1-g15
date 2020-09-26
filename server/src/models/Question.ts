import { ObjectId } from "mongodb";

import { Util } from "./Util";

export interface Question extends Util {
  markdown: string;
  answer_ids: ObjectId[];
}
