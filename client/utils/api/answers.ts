import {
  Answer,
  GetAnswersOfQuestionReq,
  CreateAnswerReq,
  getIdToken,
  EditAnswerReq,
} from "utils/index";
import {
  ANSWERS_API_URL,
  throwApiError,
  createUrlParamString,
  getAuthorizationString,
} from "./util";

async function getAnswersOfQuestion(
  req: GetAnswersOfQuestionReq
): Promise<Answer[]> {
  const res = await fetch(`${ANSWERS_API_URL}/${createUrlParamString(req)}`, {
    method: "GET",
  });

  if (!res.ok) {
    return throwApiError(res);
  }

  return res.json() as Promise<Answer[]>;
}

async function createAnswer(req: CreateAnswerReq): Promise<Answer> {
  const userIdToken: string = await getIdToken();

  const res = await fetch(ANSWERS_API_URL, {
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

  return res.json() as Promise<Answer>;
}

async function editAnswer(
  req: EditAnswerReq,
  answerId: string
): Promise<Answer> {
  const userIdToken: string = await getIdToken();

  const res = await fetch(`${ANSWERS_API_URL}/${answerId}`, {
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

async function deleteSingleAnswer(answerId: string): Promise<void> {
  const userIdToken: string = await getIdToken();

  const res = await fetch(`${ANSWERS_API_URL}/${answerId}`, {
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

export { getAnswersOfQuestion, createAnswer, editAnswer, deleteSingleAnswer };