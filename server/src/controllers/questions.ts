import { ObjectId } from "mongodb";

import { getQuestionsCollection } from "../services/database";
import Question from "../models/Question";

function getQuestions(): string {
  return "Error! Not implemented!";
}

async function createQuestion(markdown: string): Promise<Question> {
  const doc: Question = {
    _id: new ObjectId(),
    markdown: markdown,
    answer_ids: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  await getQuestionsCollection().insertOne(doc);

  return doc;
}

function updateQuestion(): string {
  return "Error! Not implemented!";
}

function deleteQuestion(): string {
  return "Error! Not implemented!";
}

export { getQuestions, createQuestion, updateQuestion, deleteQuestion };
