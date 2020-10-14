import { Router, Request, Response } from "express";

import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questions";
import {
  addQuestionToUser,
  removeQuestionFromUser,
} from "../controllers/users";
import { Question } from "../models";
import { verifyUserAuth } from "../middlewares/authRouteHandler";
import { QuestionRequestBody, HttpStatusCode } from "../utils";

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
  const userId: string = res.locals.uid;
  const questionId: string = req.params.id;
  const data: QuestionRequestBody = {
    title: req.body.title,
    markdown: req.body.markdown,
    level: req.body.level,
    subject: req.body.subject,
  };

  const updatedQuestion: Question = await updateQuestion(
    userId,
    questionId,
    data
  );

  return res.status(HttpStatusCode.OK).json(updatedQuestion);
});

// DELETE request
router.delete("/:id", verifyUserAuth, async (req: Request, res: Response) => {
  const userId: string = res.locals.uid;
  const questionId: string = req.params.id;

  await Promise.all([
    deleteQuestion(userId, questionId),
    removeQuestionFromUser(userId, questionId),
  ]);

  return res.status(HttpStatusCode.NO_CONTENT).send();
});

export default router;
