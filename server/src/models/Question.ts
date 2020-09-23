import { ObjectId } from "mongodb";

import Util from "./Util";

interface Question extends Util {
  markdown: string;
  answer_ids: ObjectId[];
}

export default Question;
