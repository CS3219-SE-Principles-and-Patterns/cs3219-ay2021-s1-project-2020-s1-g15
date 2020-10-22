// API REQUEST RESPONSE //

export type CreateAnswerRequest = {
  questionId?: string | undefined;
  markdown?: string | undefined;
};

export type EditAnswerRequest = Pick<CreateAnswerRequest, "markdown">;
