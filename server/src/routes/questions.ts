import { Router, Response } from "express";

import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questions";

const router: Router = Router();

// GET request
router.get("/", async (_, res: Response) => {
  return res.status(200).json(getQuestions());
});

// POST request
router.post("/", async (_, res: Response) => {
  return res.status(201).json(createQuestion());
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
