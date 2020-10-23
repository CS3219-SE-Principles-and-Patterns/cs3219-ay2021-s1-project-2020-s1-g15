import { UpvoteDownvoteStatus, VOTE_CMD } from "utils/constants";
import {
  Question,
  GetPaginatedQuestionRes,
  GetPaginatedQuestionsReq,
  CreateQuestionReq,
  EditQuestionReq,
} from "..";
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
const QUESTION_UPVOTE = (qid: string): string => `${qid}/upvote`;

const QUESTION_DOWNVOTE = (qid: string): string => `${qid}/downvote`;

const QUESTION_VOTE_STATUS = (qid: string): string => `${qid}/vote-status`;

async function checkVoteQuestion(
  userIdToken: string,
  questionId: string
): Promise<UpvoteDownvoteStatus> {
  const res = await fetch(
    `${QUESTIONS_API_URL}/${QUESTION_VOTE_STATUS(questionId)}`,
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

  return res.json();
}

async function upvoteQuestion(
  userIdToken: string,
  questionId: string,
  voteCmd: VOTE_CMD
): Promise<Question> {
  const res = await fetch(
    `${QUESTIONS_API_URL}/${QUESTION_UPVOTE(questionId)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        command: voteCmd,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: getAuthorizationString(userIdToken),
      },
    }
  );

  if (!res.ok) {
    return throwApiError(res);
  }

  return res.json();
}

async function downvoteQuestion(
  userIdToken: string,
  questionId: string,
  voteCmd: VOTE_CMD
): Promise<Question> {
  const res = await fetch(
    `${QUESTIONS_API_URL}/${QUESTION_DOWNVOTE(questionId)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        command: voteCmd,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: getAuthorizationString(userIdToken),
      },
    }
  );

  if (!res.ok) {
    return throwApiError(res);
  }

  return res.json();
}

export {
  getPaginatedQuestions,
  getSingleQuestion,
  createQuestion,
  editQuestion,
  deleteSingleQuestion,
  upvoteQuestion,
  downvoteQuestion,
  checkVoteQuestion,
};
