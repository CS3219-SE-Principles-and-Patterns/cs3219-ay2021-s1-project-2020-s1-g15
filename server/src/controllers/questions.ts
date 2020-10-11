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
  userId: ObjectId,
  level: Level,
  subject: Subject
): Promise<Question> {
  const doc: Question = {
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    title: title,
    slug: titleToSlug(title),
    markdown: markdown,
    userId: userId,
    answerIds: [],
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
  title: string,
  markdown: string,
  level: Level,
  subject: Subject
): Promise<Question | undefined> {
  const objectId: ObjectId = new ObjectID(id);

  const result = await getQuestionsCollection().findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        title: title,
        slug: titleToSlug(title),
        markdown: markdown,
        level: level,
        subject: subject,
        updatedAt: new Date(),
      },
    },
    { returnOriginal: false }
  );

  return result.value;
}

async function addAnswerToQuestion(
  answerId: ObjectId,
  questionId: string
): Promise<Question | undefined> {
  const objectId: ObjectId = new ObjectID(questionId);

  const result = await getQuestionsCollection().findOneAndUpdate(
    { _id: objectId },
    {
      $addToSet: {
        answerIds: answerId,
      },
    },
    { returnOriginal: false }
  );

  return result.value;
}

async function deleteAnswerFromQuestion(
  answerId: string
): Promise<Question | undefined> {
  const objectId: ObjectId = new ObjectID(answerId);

  const result = await getQuestionsCollection().findOneAndUpdate(
    { answerIds: objectId },
    {
      $pull: {
        answerIds: objectId,
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
  addAnswerToQuestion,
  deleteAnswerFromQuestion,
  deleteQuestion,
};
