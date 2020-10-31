import { stringify } from "querystring";
import { ApiErrorRes } from "..";

const BASE_API_URL: string =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8000/api"
    : "https://answerleh-server-vbfonweyuq-as.a.run.app/api";

const USERS_API_URL = `${BASE_API_URL}/users`;
const QUESTIONS_API_URL = `${BASE_API_URL}/questions`;
const ANSWERS_API_URL = `${BASE_API_URL}/answers`;
const ANSWERS_VOTE_STATUS_API_URL = `${ANSWERS_API_URL}/vote-status`;
const ANSWERS_UPVOTE_API_URL = (aid: string) =>
  `${ANSWERS_API_URL}/${aid}/upvote`;
const ANSWERS_DOWNVOTE_API_URL = (aid: string) =>
  `${ANSWERS_API_URL}/${aid}/downvote`;

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
  ANSWERS_VOTE_STATUS_API_URL,
  ANSWERS_UPVOTE_API_URL,
  ANSWERS_DOWNVOTE_API_URL,
  getAuthorizationString,
  throwApiError,
  createUrlParamString,
};
