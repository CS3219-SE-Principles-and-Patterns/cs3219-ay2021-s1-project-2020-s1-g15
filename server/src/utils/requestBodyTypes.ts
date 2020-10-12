import { Level, Subject } from "./constants";

interface QuestionRequestBody {
  title?: string | undefined;
  markdown?: string | undefined;
  level?: Level | undefined;
  subject?: Subject | undefined;
}

export { QuestionRequestBody };
