import { Router, Request, Response } from "express";
import { ObjectID } from "mongodb";

import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questions";
import { Question } from "../models";
import ApiError from "../utils/errors/ApiError";
import ApiErrorMessage from "../utils/errors/ApiErrorMessage";
import HttpStatusCode from "../utils/HttpStatusCode";

const router: Router = Router();

// GET request - list all questions
router.get("/", async (_, res: Response) => {
  const questions: Question[] = await getQuestions();

  return res.status(HttpStatusCode.OK).json(questions);
});

// GET request - get a single question by its ID
router.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  if (!ObjectID.isValid(id)) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_ID
    );
  }

  const question: Question | null = await getQuestionById(id);
  if (question == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return res.status(HttpStatusCode.OK).json(question);
});

// POST request - create a question
router.post("/", async (req: Request, res: Response) => {
  const markdown: string | undefined = req.body.markdown;
  if (markdown == null) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.MISSING_MARKDOWN_FIELD
    );
  }

  const trimmedMarkdown: string = markdown.trim();
  if (trimmedMarkdown === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_MAKDOWN_FIELD
    );
  }

  const createdQuestion: Question = await createQuestion(trimmedMarkdown);

  return res.status(HttpStatusCode.CREATED).json(createdQuestion);
});

// PUT request - update a question
router.put("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  if (!ObjectID.isValid(id)) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_ID
    );
  }

  const markdown: string | undefined = req.body.markdown;
  if (markdown == null) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.MISSING_MARKDOWN_FIELD
    );
  }

  const trimmedMarkdown: string = markdown.trim();
  if (trimmedMarkdown === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_MAKDOWN_FIELD
    );
  }

  const updatedQuestion: Question | undefined = await updateQuestion(
    id,
    trimmedMarkdown
  );
  if (updatedQuestion == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return res.status(HttpStatusCode.OK).json(updatedQuestion);
});

// DELETE request
router.delete("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  if (!ObjectID.isValid(id)) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_ID
    );
  }

  const isSuccessful: boolean = await deleteQuestion(id);
  if (!isSuccessful) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return res.status(HttpStatusCode.NO_CONTENT).send();
});

export default router;
