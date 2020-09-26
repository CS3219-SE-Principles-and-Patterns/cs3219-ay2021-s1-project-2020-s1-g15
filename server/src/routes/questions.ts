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

// PUT request - update a question
router.put("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
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

  const updatedQuestion: Question | undefined = await updateQuestion(
    id,
    trimmedMarkdown
  );
  return updatedQuestion == null
    ? res.status(404).send("Question not found")
    : res.status(200).json(updatedQuestion);
});

// DELETE request
router.delete("/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const isSuccessful: boolean = await deleteQuestion(id);

  return isSuccessful
    ? res.status(204).send()
    : res.status(404).send("Question not found");
});

export default router;
