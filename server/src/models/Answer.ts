import { ObjectId } from "mongodb";

import Util from "./Util";

interface Answer extends Util {
  markdown: string;
  question_id: ObjectId;
}

export default Answer;
