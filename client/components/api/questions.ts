import {
  ApiError,
  GetAllQuestionResponse,
  GetAllQuestionsParam,
  Question,
  QuestionParam,
} from "../../util";
import {
  createUrlParamString,
  getAuthorizationString,
  throwAPiError,
} from "./util";

const baseUrl =
  process.env.NODE_ENV == "development"
    ? `${process.env.baseUrlDev}questions/`
    : `${process.env.baseUrlDev}questions/`;

export const getAllQuestion = async ({
  page,
  pageSize,
}: GetAllQuestionsParam): Promise<GetAllQuestionResponse> => {
  const args = createUrlParamString({ page, pageSize });
  const res = await fetch(baseUrl + args, {
    method: "GET",
  });
  if (res.ok) {
    return (await res.json()) as GetAllQuestionResponse;
  } else {
    return throwAPiError(res);
  }
};

export const getSingleQuestion = async (id: string): Promise<Question> => {
  const res = await fetch(baseUrl + id, {
    method: "GET",
  });

  if (res.ok) {
    return (await res.json()) as Question;
  } else {
    return throwAPiError(res);
  }
};

export const createQuestion = async (
  question: QuestionParam,
  idToken: string
): Promise<Question> => {
  const res = await fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify({ ...question }),
    headers: {
      "Content-Type": "application/json",
      authorization: getAuthorizationString(idToken),
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

export const editQuestion = async (
  question: QuestionParam,
  idToken: string,
  qid: string
): Promise<Question> => {
  const res = await fetch(baseUrl + qid, {
    method: "PUT",
    body: JSON.stringify({ ...question }),
    headers: {
      "Content-Type": "application/json",
      authorization: getAuthorizationString(idToken),
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

export const deleteSingleQuestion = async (
  idToken: string,
  qid: string
): Promise<void> => {
  const res = await fetch(baseUrl + qid, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: getAuthorizationString(idToken),
    },
  });
  if (res.ok) {
    return;
  } else {
    const { message } = (await res.json()) as ApiError;
    throw new Error(message);
  }
};
