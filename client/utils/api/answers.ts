import {
  Answer,
  GetAnswersOfQuestionReq,
  CreateAnswerReq,
  EditAnswerReq,
  VoteCommand,
  CheckAnswerVoteStatusRes,
} from "utils/index";
import {
  ANSWERS_API_URL,
  ANSWERS_VOTE_STATUS_API_URL,
  ANSWERS_UPVOTE_API_URL,
  ANSWERS_DOWNVOTE_API_URL,
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

async function createAnswer(
  userIdToken: string,
  req: CreateAnswerReq
): Promise<Answer> {
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
  userIdToken: string,
  req: EditAnswerReq,
  answerId: string
): Promise<Answer> {
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

async function checkAnswerVoteStatus(
  userIdToken: string,
  answerIds: string[]
): Promise<CheckAnswerVoteStatusRes> {
  if (answerIds.length === 0) {
    return {};
  }

  const query = {
    answerIds: answerIds,
  };
  const res = await fetch(
    `${ANSWERS_VOTE_STATUS_API_URL}${createUrlParamString(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: getAuthorizationString(userIdToken),
      },
    }
  );

  if (!res.ok) {
    return throwApiError(res);
  }

  const answerIdToVoteStatusMap: CheckAnswerVoteStatusRes = await res.json();

  return answerIdToVoteStatusMap;
}

async function upvoteAnswer(
  userIdToken: string,
  answerId: string,
  voteCommand: VoteCommand
): Promise<Answer> {
  const res = await fetch(ANSWERS_UPVOTE_API_URL(answerId), {
    method: "PUT",
    body: JSON.stringify({
      command: voteCommand,
    }),
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

async function downvoteAnswer(
  userIdToken: string,
  answerId: string,
  voteCommand: VoteCommand
): Promise<Answer> {
  const res = await fetch(ANSWERS_DOWNVOTE_API_URL(answerId), {
    method: "PUT",
    body: JSON.stringify({
      command: voteCommand,
    }),
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

async function deleteSingleAnswer(
  userIdToken: string,
  answerId: string
): Promise<void> {
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

export {
  getAnswersOfQuestion,
  createAnswer,
  editAnswer,
  checkAnswerVoteStatus,
  upvoteAnswer,
  downvoteAnswer,
  deleteSingleAnswer,
};
