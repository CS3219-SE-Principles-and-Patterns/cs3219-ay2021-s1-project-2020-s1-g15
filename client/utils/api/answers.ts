import { Answer, GetAnswersOfQuestionReq } from "utils/index";
import { ANSWERS_API_URL, throwApiError, createUrlParamString } from "./util";

async function getAnswersOfQuestion(
  req: GetAnswersOfQuestionReq
): Promise<Answer[]> {
  const res = await fetch(`${ANSWERS_API_URL}/${createUrlParamString(req)}`, {
    method: "GET",
  });

  if (!res.ok) {
    return throwApiError(res);
  }

  return res.json();
}

export { getAnswersOfQuestion };
