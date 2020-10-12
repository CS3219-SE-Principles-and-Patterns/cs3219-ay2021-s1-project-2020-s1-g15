import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";

import {
  createAnswer,
  getAnswersByQuestionId,
  deleteAnswer,
  updateAnswer,
} from "../controllers/answers";
import { removeAnswerFromQuestion } from "../controllers/questions";
import { Answer } from "../models";
import { HttpStatusCode, ApiError, ApiErrorMessage } from "../utils";

const router: Router = Router();

// GET request - get all answers by question ID
router.get("/", async (req: Request, res: Response) => {
  const questionId: string = req.body.questionId;

  const answers: Answer[] = await getAnswersByQuestionId(questionId);

  return res.status(HttpStatusCode.OK).json(answers);
});

// POST request - create an answer
router.post("/", async (req: Request, res: Response) => {
  const markdown: string | undefined = req.body.markdown;
  const questionId: string | undefined = req.body.questionId;
  const userId: ObjectId | undefined = new ObjectId(); // TODO

  if (!markdown || !questionId) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.MISSING_REQUIRED_FIELDS
    );
  }

  if (!ObjectId.isValid(questionId)) {
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

// PUT request - update an answer
router.put("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id; //might ned to change to answerId
  if (!ObjectId.isValid(id)) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.INVALID_ID
    );
  }

  const markdown: string | undefined = req.body.markdown;

  if (!markdown) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.MISSING_REQUIRED_FIELDS
    );
  }

  const trimmedMarkdown: string = markdown.trim();
  if (trimmedMarkdown === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.INVALID_FIELDS
    );
  }

  const updatedAnswer: Answer | undefined = await updateAnswer(
    trimmedMarkdown,
    id
  );
  if (updatedAnswer == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Answer.NOT_FOUND
    );
  }

  return res.status(HttpStatusCode.OK).json(updatedAnswer);
});

// DELETE request - delete an answer
router.delete("/:id", async (req: Request, res: Response) => {
  const answerId: string = req.params.id;
  if (!ObjectId.isValid(answerId)) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.INVALID_ID
    );
  }

  const isSuccessful: boolean = await deleteAnswer(answerId);
  if (!isSuccessful) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Answer.NOT_FOUND
    );
  }

  await removeAnswerFromQuestion(answerId);

  return res.status(HttpStatusCode.NO_CONTENT).send();
});

export default router;
