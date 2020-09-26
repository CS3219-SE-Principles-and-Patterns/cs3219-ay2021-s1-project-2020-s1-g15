import { Router, Request, Response } from "express";

import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questions";
import Question from "../models/Question";

const router: Router = Router();

// GET request
router.get("/", async (_, res: Response) => {
  return res.status(200).json(getQuestions());
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
