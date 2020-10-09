import { ObjectId, ObjectID } from "mongodb";

import {
  getAnswersCollection,
  getQuestionsCollection,
} from "../services/database";
import { Answer, Question } from "../models";
import { addAnswerToQuestion, getQuestionById } from "./questions";
import ApiError from "../utils/errors/ApiError";
import HttpStatusCode from "../utils/HttpStatusCode";
import ApiErrorMessage from "../utils/errors/ApiErrorMessage";

async function getAnswersByQuestionId(questionId: string): Promise<Answer[]> {
  const questionObjectId: ObjectId = new ObjectID(questionId);

  const question: Question | null = await getQuestionsCollection().findOne({
    _id: questionObjectId,
  });

  if (question === null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  const answers: Answer[] = await getAnswersCollection()
    .find({
      questionId: questionObjectId,
    })
    .toArray();
  return answers;
}

async function createAnswer(
  markdown: string,
  questionId: string,
  userId: ObjectId
): Promise<Answer> {
  const question = await getQuestionById(questionId);

  if (question === null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }
  const doc: Answer = {
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    markdown: markdown,
    userId: userId,
    questionId: new ObjectId(questionId),
    upvotes: 0,
    downvotes: 0,
  };

  // Note: await both promises concurrently
  await Promise.all([
    addAnswerToQuestion(doc._id, questionId),
    getAnswersCollection().insertOne(doc),
  ]);

  return doc;
}

export { createAnswer, getAnswersByQuestionId };
