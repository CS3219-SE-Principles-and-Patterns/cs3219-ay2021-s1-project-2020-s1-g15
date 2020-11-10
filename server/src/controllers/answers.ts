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
  GetSingleAnswerResponse,
} from "../utils";

// for internal usage without sanitisation/sorting
async function getUnprocessedAnswersByQuestionId(
  questionId: string | ObjectId
): Promise<Answer[]> {
  const questionObjectId: ObjectId = toValidObjectId(questionId);

  const answers: Answer[] = await getAnswersCollection()
    .find({
      questionId: questionObjectId,
    })
    .toArray();

  return answers;
}

async function getAnswerById(answerId: string | ObjectId): Promise<Answer> {
  const answerObjectId: ObjectId = toValidObjectId(answerId);
  const answer: Answer | null = await getAnswersCollection().findOne({
    _id: answerObjectId,
  });

  if (answer === null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Answer.NOT_FOUND
    );
  }
  return answer;
}

async function getAnswersByQuestionId(
  questionId: string | ObjectId,
  sortBy: string | undefined
): Promise<GetSingleAnswerResponse[]> {
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

  const result: GetSingleAnswerResponse[] = await getAnswersCollection()
    .aggregate<GetSingleAnswerResponse>([
      {
        // match only the questionObjectId
        $match: { questionId: questionObjectId },
      },
      {
        // join the users collection
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        // flatten resulting array to one doc
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // add nettVote field so we can sort by it later
        $addFields: {
          nettVotes: {
            $subtract: ["$upvotes", "$downvotes"],
          },
        },
      },
      {
        $sort:
          sortBy === "createdAt"
            ? { createdAt: -1 }
            : { nettVotes: -1, upvotes: -1, createdAt: -1 },
      },
      {
        // exclude certain fields
        $project: {
          userId: false,
          nettVotes: false,
          user: {
            createdAt: false,
            updatedAt: false,
            questionIds: false,
            answerIds: false,
          },
        },
      },
    ])
    .toArray();

  return result;
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
  getAnswerById,
  createAnswer,
  getUnprocessedAnswersByQuestionId,
  getAnswersByQuestionId,
  getAnswersByUserId,
  deleteAnswer,
  updateAnswer,
  updateAnswerVotes,
  deleteAllAnswersByQuestionId,
};
