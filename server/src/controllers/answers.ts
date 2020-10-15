import { ObjectId } from "mongodb";

import {
  getAnswersCollection,
  getQuestionsCollection,
} from "../services/database";
import { Answer, Question } from "../models";
import {
  HttpStatusCode,
  ApiError,
  ApiErrorMessage,
  toValidObjectId,
  AnswerRequestBody,
} from "../utils";

async function getAnswersByQuestionId(
  questionId: string | ObjectId
): Promise<Answer[]> {
  const questionObjectId: ObjectId = toValidObjectId(questionId);

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

async function createAnswer(data: AnswerRequestBody): Promise<Answer> {
  const { questionId, markdown }: AnswerRequestBody = data;

  if (!markdown || !questionId) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.MISSING_REQUIRED_FIELDS
    );
  }

  const questionObjectId: ObjectId = toValidObjectId(questionId);
  const trimmedMarkdown: string = markdown.trim();
  if (trimmedMarkdown === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.INVALID_FIELDS
    );
  }

  const doc: Answer = {
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    markdown: trimmedMarkdown,
    questionId: questionObjectId,
    upvotes: 0,
    downvotes: 0,
  };

  await getAnswersCollection().insertOne(doc);

  return doc;
}

async function updateAnswer(
  answerId: string | ObjectId,
  data: AnswerRequestBody
): Promise<Answer> {
  const answerObjectId: ObjectId = toValidObjectId(answerId);
  const { markdown }: AnswerRequestBody = data;

  if (!markdown) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.MISSING_REQUIRED_FIELDS
    );
  }

  const trimmedMarkdown: string = markdown.trim();
  if (trimmedMarkdown === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Answer.INVALID_FIELDS
    );
  }

  const result = await getAnswersCollection().findOneAndUpdate(
    { _id: answerObjectId },
    {
      $set: {
        markdown: trimmedMarkdown,
        updatedAt: new Date(),
      },
    },
    { returnOriginal: false }
  );

  const updatedAnswer: Answer | undefined = result.value;
  if (updatedAnswer == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Answer.NOT_FOUND
    );
  }

  return updatedAnswer;
}

async function deleteAnswer(id: string): Promise<boolean> {
  const objectId: ObjectId = new ObjectId(id);

  const result = await getAnswersCollection().findOneAndDelete({
    _id: objectId,
  });

  return result.value != null;
}

export { createAnswer, getAnswersByQuestionId, deleteAnswer, updateAnswer };
