import { Router, Request, Response } from "express";

import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questions";
import Question from "../models/Question";

const router: Router = Router();

// GET request - list all questions
router.get("/", async (_, res: Response) => {
  const questions: Question[] = await getQuestions();

  return res.status(200).json(questions);
});

// GET request - get a single question by its ID
router.get("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const question: Question | null = await getQuestionById(id);

  return question === null
    ? res.status(404).send("Question not found")
    : res.status(200).json(question);
});

// POST request - create a question
router.post("/", async (req: Request, res: Response) => {
  const markdown: string | undefined = req.body.markdown;
  if (!markdown) {
    return res.status(400).send("Required field markdown is missing");
  }

  const trimmedMarkdown: string = markdown.trim();
  if (!trimmedMarkdown) {
    return res
      .status(400)
      .send("Required field markdown cannot be empty string");
  }

  const createdQuestion: Question = await createQuestion(trimmedMarkdown);

  return res.status(201).json(createdQuestion);
});

// PUT request
router.put("/:id", async (_, res: Response) => {
  return res.status(200).send(updateQuestion());
});

// DELETE request
router.delete("/:id", async (_, res: Response) => {
  return res.status(200).send(deleteQuestion());
});

export default router;
