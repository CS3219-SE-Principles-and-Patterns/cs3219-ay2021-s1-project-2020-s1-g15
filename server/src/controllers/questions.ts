import { ObjectId, ObjectID } from "mongodb";

import { getQuestionsCollection } from "../services/database";
import Question from "../models/Question";

// TODO: add pagination/search/filter in the future
async function getQuestions(): Promise<Question[]> {
  const questions: Question[] = await getQuestionsCollection().find().toArray();

  return questions;
}

async function getQuestionById(id: string): Promise<Question | null> {
  if (!ObjectID.isValid(id)) {
    return null;
  }

  const objectId: ObjectId = new ObjectID(id);

  const question: Question | null = await getQuestionsCollection().findOne({
    _id: objectId,
  });

  return question;
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

async function updateQuestion(
  id: string,
  markdown: string
): Promise<Question | undefined> {
  if (!ObjectID.isValid(id)) {
    return undefined;
  }

  const objectId: ObjectId = new ObjectID(id);

  const result = await getQuestionsCollection().findOneAndUpdate(
    { _id: objectId },
    { $set: { markdown: markdown, updated_at: new Date() } },
    { returnOriginal: false }
  );

  return result.value;
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
