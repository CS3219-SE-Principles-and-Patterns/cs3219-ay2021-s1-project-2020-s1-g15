import { RegisterUserReq, User, GetSingleUserRes } from "..";
import { USERS_API_URL, throwApiError, createUrlParamString } from "./util";
import { Answer, GetSingleUserReq, Question } from "utils/types";

function getUsersIdUrl(id: string) {
  return `${USERS_API_URL}/${id}`;
}

async function registerUser(req: RegisterUserReq): Promise<GetSingleUserRes> {
  const res = await fetch(USERS_API_URL, {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
      authorization: "basic" + btoa(req.email + ":" + req.password),
    },
  });

  if (!res.ok) {
    return throwApiError(res);
  }

  const userApi = (await res.json()) as GetSingleUserRes;
  return userApi;
}

async function getSingleUser(req: GetSingleUserReq): Promise<User> {
  const res = await fetch(`${USERS_API_URL}/${createUrlParamString(req)}`, {
    method: "GET",
  });

  const userApi = (await res.json()) as GetSingleUserRes;

  const questionRes: Promise<Response> = fetch(
    `${USERS_API_URL}/${userApi._id}/questions`,
    {
      method: "GET",
    }
  );
  const answerRes: Promise<Response> = fetch(
    `${USERS_API_URL}/${userApi._id}/answers`,
    {
      method: "GET",
    }
  );

  const [questionsFromUser, answersByUser] = await Promise.all([
    questionRes,
    answerRes,
  ]);
  if (!questionsFromUser || !answersByUser.ok || !res.ok) {
    return throwApiError(res);
  }
  const questions: Question[] = await questionsFromUser.json();
  const answers: Answer[] = await answersByUser.json();

  userApi.questions = questions;
  userApi.answers = answers;

  return userApi as User;
}

export { registerUser, getSingleUser };
