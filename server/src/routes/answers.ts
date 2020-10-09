import { Router, Request, Response } from "express";
import { ObjectID, ObjectId } from "mongodb";

import { createAnswer } from "../controllers/answers";
import { Answer } from "../models";
import ApiError from "../utils/errors/ApiError";
import ApiErrorMessage from "../utils/errors/ApiErrorMessage";
import HttpStatusCode from "../utils/HttpStatusCode";

const router: Router = Router();

// POST request - create an answer
router.post("/", async (req: Request, res: Response) => {
  const markdown: string | undefined = req.body.markdown;
  const questionId: string | undefined = req.body.questionId;
  const userId: ObjectId | undefined = new ObjectID(); // TODO

  if (!markdown || !questionId) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.MISSING_REQUIRED_FIELDS
    );
  }

  if (!ObjectID.isValid(questionId)) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_ID
    );
  }

  const trimmedMarkdown: string = markdown.trim();
  if (trimmedMarkdown === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.INVALID_FIELDS
    );
  }

  const createdAnswer: Answer = await createAnswer(
    trimmedMarkdown,
    questionId,
    userId
  );

  return res.status(HttpStatusCode.CREATED).json(createdAnswer);
});

export default router;
