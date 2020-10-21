import { Level, Subject } from "../constants";

export interface QuestionRequestBody {
  title?: string | undefined;
  markdown?: string | undefined;
  level?: Level | undefined;
  subject?: Subject | undefined;
  upvotes?: number | undefined;
  downvotes?: number | undefined;
}
