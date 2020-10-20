import {
  Question,
  GetSingleQuestionParam,
  GetPaginatedQuestionRes,
  GetPaginatedQuestionsParam,
} from "../../util";
import {
  QUESTIONS_API_URL,
  createUrlParamString,
  getAuthorizationString,
  throwApiError,
} from "./util";

async function getPaginatedQuestions(
  getAllQuestionsParam: GetPaginatedQuestionsParam
): Promise<GetPaginatedQuestionRes> {
  const res = await fetch(
    `${QUESTIONS_API_URL}/${createUrlParamString(getAllQuestionsParam)}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    throwApiError(res);
  }

  return res.json();
}

async function getSingleQuestion(id: string): Promise<Question> {
  const res = await fetch(`${QUESTIONS_API_URL}/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    throwApiError(res);
  }

  return res.json();
}

async function createQuestion(
  questionReqParam: GetSingleQuestionParam,
  userIdToken: string
): Promise<Question> {
  const res = await fetch(QUESTIONS_API_URL, {
    method: "POST",
    body: JSON.stringify(questionReqParam),
    headers: {
      "Content-Type": "application/json",
      authorization: getAuthorizationString(userIdToken),
    },
  });

  if (!res.ok) {
    throwApiError(res);
  }

  return res.json();
}

async function editQuestion(
  questionReqParam: GetSingleQuestionParam,
  userIdToken: string,
  questionId: string
): Promise<Question> {
  const res = await fetch(`${QUESTIONS_API_URL}/${questionId}`, {
    method: "PUT",
    body: JSON.stringify(questionReqParam),
    headers: {
      "Content-Type": "application/json",
      authorization: getAuthorizationString(userIdToken),
    },
  });

  if (!res.ok) {
    throwApiError(res);
  }

  return res.json();
}

async function deleteSingleQuestion(
  userIdToken: string,
  questionId: string
): Promise<void> {
  const res = await fetch(`${QUESTIONS_API_URL}/${questionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: getAuthorizationString(userIdToken),
    },
  });

  if (!res.ok) {
    throwApiError(res);
  }
}

export {
  getPaginatedQuestions,
  getSingleQuestion,
  createQuestion,
  editQuestion,
  deleteSingleQuestion,
};
