import Util from "./Util";

interface Question extends Util {
  markdown: string;
  answer_ids: string[];
}

export default Question;
