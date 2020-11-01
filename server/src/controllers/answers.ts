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
  CreateAnswerRequest,
  EditAnswerRequest,
  VoteIncrementObject,
} from "../utils";

async function getAnswersByQuestionId(
  questionId: string | ObjectId,
  sortBy: string | undefined
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

  const sortedAnswers = answers.sort((a: Answer, b: Answer) => {
    if (sortBy === "createdAt") {
      return b.createdAt.valueOf() - a.createdAt.valueOf();
    }

    const nettVotesA: number = a.upvotes - a.downvotes;
    const nettVotesB: number = b.upvotes - b.downvotes;

    if (nettVotesA === nettVotesB) {
      return b.upvotes - a.upvotes;
    } else {
      return nettVotesB - nettVotesA;
    }
  });
  return sortedAnswers;
}

async function getAnswersByUserId(
  userId: string | ObjectId
): Promise<Answer[]> {
  const userObjectId: ObjectId = toValidObjectId(userId);

  const answers: Answer[] = await getAnswersCollection()
    .find({
      userId: userObjectId,
    })
    .toArray();

  return answers;
}

async function createAnswer(
  userId: string | ObjectId,
  data: CreateAnswerRequest
): Promise<Answer> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const { questionId, markdown }: CreateAnswerRequest = data;

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
    userId: userObjectId,
    questionId: questionObjectId,
    upvotes: 0,
    downvotes: 0,
  };

  await getAnswersCollection().insertOne(doc);

  return doc;
}

async function updateAnswer(
  userId: string | ObjectId,
  answerId: string | ObjectId,
  data: EditAnswerRequest
): Promise<Answer> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const answerObjectId: ObjectId = toValidObjectId(answerId);
  const { markdown }: EditAnswerRequest = data;

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
    {
      _id: answerObjectId,
      userId: userObjectId, // make sure user can only update his own answer
    },
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

async function updateAnswerVotes(
  answerId: string | ObjectId,
  voteIncrementObject: VoteIncrementObject
): Promise<Answer> {
  const answerObjectId: ObjectId = toValidObjectId(answerId);

  const result = await getAnswersCollection().findOneAndUpdate(
    {
      _id: answerObjectId,
    },
    {
      $inc: voteIncrementObject,
    },
    { returnOriginal: false }
  );

  const updatedAnswer: Answer | undefined = result.value;
  if (updatedAnswer == null) {
    //TODO: remove vote created if not found
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Answer.NOT_FOUND
    );
  }

  return updatedAnswer;
}

async function deleteAnswer(
  userId: string | ObjectId,
  id: string | ObjectId
): Promise<boolean> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const answerObjectId: ObjectId = toValidObjectId(id);

  const result = await getAnswersCollection().findOneAndDelete({
    _id: answerObjectId,
    userId: userObjectId, // make sure user can only delete his own question
  });

  const originalAnswer: Answer | undefined = result.value;
  const isSuccessful: boolean = originalAnswer != null;
  if (!isSuccessful) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Answer.NOT_FOUND
    );
  }

  return isSuccessful;
}

async function deleteAllAnswersByQuestionId(
  questionId: string | ObjectId
): Promise<void> {
  const questionObjectId: ObjectId = toValidObjectId(questionId);

  await getAnswersCollection().deleteMany({
    questionId: questionObjectId,
  });

  return;
}

export {
  createAnswer,
  getAnswersByQuestionId,
  getAnswersByUserId,
  deleteAnswer,
  updateAnswer,
  updateAnswerVotes,
  deleteAllAnswersByQuestionId,
};
