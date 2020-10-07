import { ObjectId, ObjectID } from "mongodb";

import { getQuestionsCollection } from "../services/database";
import { Question } from "../models";
import { Level, Subject } from "../utils/constants";
import titleToSlug from "../utils/titleToSlug";

// TODO: add pagination/search/filter in the future
async function getQuestions(): Promise<Question[]> {
  const questions: Question[] = await getQuestionsCollection().find().toArray();

  return questions;
}

async function getQuestionById(id: string): Promise<Question | null> {
  const objectId: ObjectId = new ObjectID(id);

  const question: Question | null = await getQuestionsCollection().findOne({
    _id: objectId,
  });

  return question;
}

async function createQuestion(
  title: string,
  markdown: string,
  user_id: ObjectId,
  level: Level,
  subject: Subject
): Promise<Question> {
  const doc: Question = {
    _id: new ObjectId(),
    created_at: new Date(),
    updated_at: new Date(),
    title: title,
    slug: titleToSlug(title),
    markdown: markdown,
    user_id: user_id,
    answer_ids: [],
    level: level,
    subject: subject,
    upvotes: 0,
    downvotes: 0,
  };

  await getQuestionsCollection().insertOne(doc);

  return doc;
}

async function updateQuestion(
  id: string,
  markdown: string,
  level: Level,
  subject: Subject
): Promise<Question | undefined> {
  const objectId: ObjectId = new ObjectID(id);

  const result = await getQuestionsCollection().findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        markdown: markdown,
        level: level,
        subject: subject,
        updated_at: new Date(),
      },
    },
    { returnOriginal: false }
  );

  return result.value;
}

async function deleteQuestion(id: string): Promise<boolean> {
  const objectId: ObjectId = new ObjectID(id);

  const result = await getQuestionsCollection().findOneAndDelete({
    _id: objectId,
  });

  return result.value != null;
}

export {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
