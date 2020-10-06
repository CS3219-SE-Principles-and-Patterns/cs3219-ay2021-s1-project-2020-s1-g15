import { Router, Request, Response } from "express";
import { ObjectID, ObjectId } from "mongodb";

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
import { Level, Subject } from "../utils/constants";

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
  const title: string | undefined = req.body.title;
  const markdown: string | undefined = req.body.markdown;
  const user_id: ObjectId | undefined = new ObjectID(); // TODO
  const level: Level | undefined = req.body.level;
  const subject: Subject | undefined = req.body.subject;

  if (!title || !markdown || !level || !subject) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.MISSING_REQUIRED_FIELDS
    );
  }

  const trimmedTitle: string = title.trim();
  const trimmedMarkdown: string = markdown.trim();
  if (trimmedMarkdown === "" || trimmedTitle === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_FIELDS
    );
  }

  const createdQuestion: Question = await createQuestion(
    trimmedTitle,
    trimmedMarkdown,
    user_id,
    level,
    subject
  );

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
  const level: Level | undefined = req.body.level;
  const subject: Subject | undefined = req.body.subject;

  if (!markdown || !level || !subject) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.MISSING_REQUIRED_FIELDS
    );
  }

  const trimmedMarkdown: string = markdown.trim();
  if (trimmedMarkdown === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_FIELDS
    );
  }

  const updatedQuestion: Question | undefined = await updateQuestion(
    id,
    trimmedMarkdown,
    level,
    subject
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
