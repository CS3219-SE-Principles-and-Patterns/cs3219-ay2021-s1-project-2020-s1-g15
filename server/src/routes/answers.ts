import { ObjectId } from "mongodb";
import { Router, Request, Response } from "express";

import { Answer } from "../models";
import { verifyUserAuth } from "../middlewares/authRouteHandler";
import {
  createAnswer,
  getAnswersByQuestionId,
  deleteAnswer,
  updateAnswer,
} from "../controllers/answers";
import {
  addAnswerToQuestion,
  getQuestionById,
  removeAnswerFromQuestion,
} from "../controllers/questions";
import { addAnswerToUser, removeAnswerFromUser } from "../controllers/users";
import {
  HttpStatusCode,
  CreateAnswerRequest,
  EditAnswerRequest,
} from "../utils";

const router: Router = Router();

// GET request - get all answers by question ID
router.get("/", async (req: Request, res: Response) => {
  // typecase to string; let controller handle the error handling
  const questionId: string = req.query.questionId as string;

  const answers: Answer[] = await getAnswersByQuestionId(questionId);

  return res.status(HttpStatusCode.OK).json(answers);
});

// POST request - create an answer
router.post("/", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = res.locals.uid;
  const data: CreateAnswerRequest = {
    questionId: req.body.questionId,
    markdown: req.body.markdown,
  };

  // try to get question by question ID to check if question exists:
  await getQuestionById(data.questionId as string);

  // create the answer:
  const createdAnswer: Answer = await createAnswer(userId, data);

  // add answer ID to the question:
  await addAnswerToQuestion(createdAnswer.questionId, createdAnswer._id);

  // add answer ID to the user:
  await addAnswerToUser(userId, createdAnswer._id);

  return res.status(HttpStatusCode.CREATED).json(createdAnswer);
});

// PUT request - update an answer
router.put("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = res.locals.uid;
  const answerId: string = req.params.id;
  const data: EditAnswerRequest = {
    markdown: req.body.markdown,
  };
  const updatedAnswer: Answer = await updateAnswer(userId, answerId, data);

  return res.status(HttpStatusCode.OK).json(updatedAnswer);
});

// DELETE request - delete an answer
router.delete("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: ObjectId = res.locals.uid;
  const answerId: string = req.params.id;

  await Promise.all([
    deleteAnswer(userId, answerId),
    removeAnswerFromQuestion(answerId),
    removeAnswerFromUser(userId, answerId),
  ]);

  return res.status(HttpStatusCode.NO_CONTENT).send();
});

export default router;
