import { Question } from "src/models";

export interface GetQuestionRequestResponse {
  questions: Question[];
  total: number;
}
