import {
  ApiError,
  CreateQuestionParam,
  GetAllQuestionsParam,
  Question,
} from "../../util";

const baseUrl =
  process.env.NODE_ENV == "development"
    ? `${process.env.baseUrlDev}questions/`
    : `${process.env.baseUrlDev}questions/`;

export const getAllQuestion = async ({
  page,
  pageSize,
}: GetAllQuestionsParam): Promise<Question[]> => {
  const res = await fetch(baseUrl, {
    method: "GET",
  });
  return await res.json();
};

export const getSingleQuestion = async ({ id }): Promise<Question> => {
  const res = await fetch(baseUrl + id, {
    method: "GET",
  });
  return await res.json();
};

export const createQuestion = async (
  question: CreateQuestionParam
): Promise<Question> => {
  const res = await fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify({ ...question }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const question = (await res.json()) as Question;
    return question;
  } else {
    const { message } = (await res.json()) as ApiError;
    throw new Error(message);
  }
};
