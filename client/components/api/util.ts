import { stringify } from "querystring";
import { ApiErrorRes } from "../../util";

const BASE_API_URL: string =
  process.env.NODE_ENV == "development"
    ? "http://localhost:8000/api"
    : "http://localhost:8000/api";

const USERS_API_URL = `${BASE_API_URL}/users`;
const QUESTIONS_API_URL = `${BASE_API_URL}/questions`;
const ANSWERS_API_URL = `${BASE_API_URL}/answers`;

function getAuthorizationString(idToken: string): string {
  return "Bearer " + idToken;
}

async function throwApiError(res: Response): Promise<never> {
  const { message } = (await res.json()) as ApiErrorRes;
  throw new Error(message);
}

function createUrlParamString(param: any): string {
  return "?" + stringify(param);
}

export {
  USERS_API_URL,
  QUESTIONS_API_URL,
  ANSWERS_API_URL,
  getAuthorizationString,
  throwApiError,
  createUrlParamString,
};
