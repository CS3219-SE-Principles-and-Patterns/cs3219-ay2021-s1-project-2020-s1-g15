import { ObjectId, ObjectID } from "mongodb";

import { getQuestionsCollection } from "../services/database";
import Question from "../models/Question";

// TODO: add pagination/search/filter in the future
async function getQuestions(): Promise<Question[]> {
  const questions: Question[] = await getQuestionsCollection().find().toArray();

  return questions;
}

async function getQuestionById(id: string): Promise<Question | null> {
  try {
    const objectId: ObjectId = new ObjectID(id);

    const question: Question | null = await getQuestionsCollection().findOne({
      _id: objectId,
    });

    return question;
  } catch (error) {
    return null;
  }
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

async function updateQuestion(id: string, markdown: string): Promise<boolean> {
  try {
    const objectId: ObjectId = new ObjectID(id);

    const result = await getQuestionsCollection().updateOne(
      { _id: objectId },
      { $set: { markdown: markdown, updated_at: new Date() } }
    );

    return result.modifiedCount === 1;
  } catch (error) {
    return false;
  }
}

function deleteQuestion(): string {
  return "Error! Not implemented!";
}

export {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
