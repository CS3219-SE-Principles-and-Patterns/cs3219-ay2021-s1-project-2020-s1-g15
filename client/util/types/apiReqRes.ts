import { Util, Question } from "util/index";

export type GetPaginatedQuestionsReq = {
  page: number;
  pageSize: number;
};

export type GetPaginatedQuestionRes = {
  questions: Question[];
  total: number;
};

export type CreateQuestionReq = {
  title: string;
  markdown: string;
  level: string;
  subject: string;
};

export type EditQuestionReq = CreateQuestionReq;

export type ApiErrorRes = {
  status: string;
  message: string;
};

export type RegisterUserReq = {
  email: string;
  password: string;
};

export type GetSingleUserRes = Util & {
  email: string;
  username: string;
  answerIds: string[];
  questionIds: string[];
};
