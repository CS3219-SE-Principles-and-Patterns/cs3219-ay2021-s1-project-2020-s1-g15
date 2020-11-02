// API REQUEST RESPONSE //

import { User, Answer } from "src/models";

export type GetSingleAnswerResponse = Omit<Answer, "userId"> & {
  user: Pick<User, "_id" | "email" | "username">;
};

export type CreateAnswerRequest = {
  questionId?: string | undefined;
  markdown?: string | undefined;
};

export type EditAnswerRequest = Pick<CreateAnswerRequest, "markdown">;
