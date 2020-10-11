import { Router, Request, Response } from "express";
import { ObjectID, ObjectId } from "mongodb";
import { deleteAnswerFromQuestion } from "../controllers/questions";

<<<<<<< Updated upstream
import {
  createAnswer,
  getAnswersByQuestionId,
  deleteAnswer,
} from "../controllers/answers";
=======
import { createAnswer, getAnswersByQuestionId, deleteAnswer, updateAnswer } from "../controllers/answers";
>>>>>>> Stashed changes
import { Answer } from "../models";
import ApiError from "../utils/errors/ApiError";
import ApiErrorMessage from "../utils/errors/ApiErrorMessage";
import HttpStatusCode from "../utils/HttpStatusCode";

const router: Router = Router();

// GET request - get all answers by question ID
router.get("/", async (req: Request, res: Response) => {
  const questionId: string | undefined = req.body.questionId;

  if (!questionId) {
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

  const answers: Answer[] = await getAnswersByQuestionId(questionId);

  return res.status(HttpStatusCode.OK).json(answers);
});

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

//PUT request - update an answer
router.put("/", async (req: Request, res: Response) => {
  const id: string = req.body.id; //might ned to change to answerId
  if (!ObjectID.isValid(id)) {
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

//DELETE request - delete an answer
router.delete("/", async (req: Request, res: Response) => {
  const answerId: string = req.body.answerId;
  if (!ObjectID.isValid(answerId)) {
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

  await deleteAnswerFromQuestion(answerId);

  return res.status(HttpStatusCode.NO_CONTENT).send();
});

export default router;
