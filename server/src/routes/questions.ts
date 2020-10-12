import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";

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
import { verifyUserAuth } from "../middlewares/authRouteHandler";
import { QuestionRequestBody } from "../utils/requestBodyTypes";
import { addQuestionToUser } from "../controllers/users";

const router: Router = Router();

// GET request - list all questions
router.get("/", async (_, res: Response) => {
  const questions: Question[] = await getQuestions();

  return res.status(HttpStatusCode.OK).json(questions);
});

// GET request - get a single question by its ID
router.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const question: Question = await getQuestionById(id);

  return res.status(HttpStatusCode.OK).json(question);
});

// POST request - create a question
router.post("/", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: string = res.locals.uid;
  const data: QuestionRequestBody = {
    title: req.body.title,
    markdown: req.body.markdown,
    level: req.body.level,
    subject: req.body.subject,
  };

  // create the question:
  const createdQuestion: Question = await createQuestion(userId, data);
  // add the question ID to the user:
  await addQuestionToUser(userId, createdQuestion._id);

  return res.status(HttpStatusCode.CREATED).json(createdQuestion);
});

// PUT request - update a question
router.put("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = new ObjectId(res.locals.uid);
  const questionId: string = req.params.id;
  if (!ObjectId.isValid(questionId)) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_ID
    );
  }

  const title: string | undefined = req.body.title;
  const markdown: string | undefined = req.body.markdown;
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
  if (trimmedTitle === "" || trimmedMarkdown === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_FIELDS
    );
  }

  const updatedQuestion: Question | undefined = await updateQuestion(
    userId,
    questionId,
    trimmedTitle,
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
router.delete("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = new ObjectId(res.locals.uid);
  const questionId: string = req.params.id;
  if (!ObjectId.isValid(questionId)) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_ID
    );
  }

  const isSuccessful: boolean = await deleteQuestion(questionId, userId);
  if (!isSuccessful) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return res.status(HttpStatusCode.NO_CONTENT).send();
});

export default router;
