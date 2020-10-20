import {
  Question,
  GetPaginatedQuestionRes,
  GetPaginatedQuestionsReq,
  CreateQuestionReq,
  EditQuestionReq,
} from "../../util";
import {
  QUESTIONS_API_URL,
  createUrlParamString,
  getAuthorizationString,
  throwApiError,
} from "./util";

async function getPaginatedQuestions(
  req: GetPaginatedQuestionsReq
): Promise<GetPaginatedQuestionRes> {
  const res = await fetch(`${QUESTIONS_API_URL}/${createUrlParamString(req)}`, {
    method: "GET",
  });

  if (!res.ok) {
    return throwApiError(res);
  }

  return res.json();
}

async function getSingleQuestion(id: string): Promise<Question> {
  const res = await fetch(`${QUESTIONS_API_URL}/${id}`, {
    method: "GET",
  });

  if (!res.ok) {
    return throwApiError(res);
  }

  return res.json();
}

async function createQuestion(
  req: CreateQuestionReq,
  userIdToken: string
): Promise<Question> {
  const res = await fetch(QUESTIONS_API_URL, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
      authorization: getAuthorizationString(userIdToken),
    },
  });

  if (!res.ok) {
    return throwApiError(res);
  }

  return res.json();
}

async function editQuestion(
  req: EditQuestionReq,
  userIdToken: string,
  questionId: string
): Promise<Question> {
  const res = await fetch(`${QUESTIONS_API_URL}/${questionId}`, {
    method: "PUT",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
      authorization: getAuthorizationString(userIdToken),
    },
  });

  if (!res.ok) {
    return throwApiError(res);
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
    return throwApiError(res);
  }
}

export {
  getPaginatedQuestions,
  getSingleQuestion,
  createQuestion,
  editQuestion,
  deleteSingleQuestion,
};
