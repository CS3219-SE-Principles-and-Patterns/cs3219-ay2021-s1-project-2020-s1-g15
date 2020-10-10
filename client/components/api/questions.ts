import {
  CreateQuestionParam,
  CreateQuestionResponse,
  GetAllQuestionsParam,
  Question,
} from "../../util";
import HttpStatusCode from "../../util/HttpStatusCode";

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
): Promise<CreateQuestionResponse> => {
  const res = await fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify({ ...question }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(res);
  if (res.ok) {
    const question = (await res.json()) as Question;
    return {
      status: HttpStatusCode.CREATED,
      question,
      message: "Successfully Created",
    };
  } else {
    return await res.json();
  }
};
