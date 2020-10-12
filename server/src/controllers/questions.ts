import { ObjectId } from "mongodb";

import ApiError from "../utils/errors/ApiError";
import ApiErrorMessage from "../utils/errors/ApiErrorMessage";
import HttpStatusCode from "../utils/HttpStatusCode";
import { getQuestionsCollection } from "../services/database";
import { Question } from "../models";
import { Level, Subject } from "../utils/constants";
import titleToSlug from "../utils/titleToSlug";
import toValidObjectId from "../utils/toValidObjectId";
import { addQuestionToUser, removeQuestionFromUser } from "./users";

// TODO: add pagination/search/filter in the future
async function getQuestions(): Promise<Question[]> {
  const questions: Question[] = await getQuestionsCollection().find().toArray();

  return questions;
}

async function getQuestionById(id: string | ObjectId): Promise<Question> {
  const questionObjectId: ObjectId = toValidObjectId(id);

  const question: Question | null = await getQuestionsCollection().findOne({
    _id: questionObjectId,
  });

  if (question == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return question;
}

async function createQuestion(
  userId: ObjectId,
  title: string,
  markdown: string,
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

  await Promise.all([
    getQuestionsCollection().insertOne(doc),
    addQuestionToUser(doc._id, userId),
  ]);

  return doc;
}

async function updateQuestion(
  userId: ObjectId,
  questionId: string,
  title: string,
  markdown: string,
  level: Level,
  subject: Subject
): Promise<Question | undefined> {
  const objectId: ObjectId = new ObjectId(questionId);

  const result = await getQuestionsCollection().findOneAndUpdate(
    {
      _id: objectId,
      userId: userId, // make sure user can only update his own question
    },
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
  const objectId: ObjectId = new ObjectId(questionId);

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
  const objectId: ObjectId = new ObjectId(answerId);

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

async function deleteQuestion(
  questionId: string,
  userId: ObjectId
): Promise<boolean> {
  const questionObjectId = new ObjectId(questionId);

  const [result] = await Promise.all([
    getQuestionsCollection().findOneAndDelete({
      _id: questionObjectId,
      userId: userId, // make sure user can only delete his own question
    }),
    removeQuestionFromUser(questionObjectId, userId),
  ]);

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
