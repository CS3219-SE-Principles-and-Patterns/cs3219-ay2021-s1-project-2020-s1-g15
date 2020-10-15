import { Router, Request, Response } from "express";

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
import { Answer } from "../models";
import { HttpStatusCode, AnswerRequestBody } from "../utils";

const router: Router = Router();

// GET request - get all answers by question ID
router.get("/", async (req: Request, res: Response) => {
  const questionId: string = req.body.questionId;

  const answers: Answer[] = await getAnswersByQuestionId(questionId);

  return res.status(HttpStatusCode.OK).json(answers);
});

// POST request - create an answer
router.post("/", async (req: Request, res: Response) => {
  const data: AnswerRequestBody = {
    questionId: req.body.questionId,
    markdown: req.body.markdown,
  };

  // try to get question by question ID to check if question exists:
  await getQuestionById(data.questionId as string);

  // create the answer:
  const createdAnswer: Answer = await createAnswer(data);

  // add answer ID to the question:
  await addAnswerToQuestion(createdAnswer.questionId, createdAnswer._id);

  return res.status(HttpStatusCode.CREATED).json(createdAnswer);
});

// PUT request - update an answer
router.put("/:id", async (req: Request, res: Response) => {
  const answerId: string = req.params.id;
  const data: AnswerRequestBody = {
    markdown: req.body.markdown,
  };
  const updatedAnswer: Answer = await updateAnswer(answerId, data);

  return res.status(HttpStatusCode.OK).json(updatedAnswer);
});

// DELETE request - delete an answer
router.delete("/:id", async (req: Request, res: Response) => {
  const answerId: string = req.params.id;

  await Promise.all([
    deleteAnswer(answerId),
    removeAnswerFromQuestion(answerId),
  ]);

  return res.status(HttpStatusCode.NO_CONTENT).send();
});

export default router;
