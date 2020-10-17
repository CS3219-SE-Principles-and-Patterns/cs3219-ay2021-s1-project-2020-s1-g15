import {
  ApiError,
  Question,
  RegisterUserParam,
  User,
  UserApi,
} from "../../util";
import { getSingleQuestion } from "./questions";
import { throwAPiError } from "./util";

const baseUrl =
  process.env.NODE_ENV == "development"
    ? `${process.env.baseUrlDev}users/`
    : `${process.env.baseUrlDev}users/`;

export const registerUser = async (
  param: RegisterUserParam
): Promise<UserApi> => {
  const { email, password } = param;

  const res = await fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
      authorization: "basic" + btoa(email + ":" + password),
    },
  });

  if (res.ok) {
    const userApi = (await res.json()) as UserApi;
    return userApi;
  } else {
    const { message } = (await res.json()) as ApiError;
    throw new Error(message);
  }
};
// get past type check
export const getSingleUser = async (id: string | string[]) => {
  const res = await fetch(baseUrl + id, {
    method: "GET",
  });

  if (res.ok) {
    const userApi = (await res.json()) as UserApi;
    const { questionIds, answerIds } = userApi;
    const questions: Question[] = [];
    try {
      const res = await Promise.all(
        questionIds.map(async (id: string) => {
          const question = await getSingleQuestion({ id });
          questions.push(question);
        })
      );
    } catch (err) {
      return throwAPiError(err);
    }

    return { ...userApi, questions, answers: [] } as User;
  } else {
    return throwAPiError(res);
  }
};
