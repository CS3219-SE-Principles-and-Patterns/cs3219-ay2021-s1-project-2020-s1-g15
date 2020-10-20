import { ObjectId } from "mongodb";

import { getCollection } from "../services/database";
import { Question } from "../models";
import {
  HttpStatusCode,
  ApiError,
  ApiErrorMessage,
  QuestionRequestBody,
  titleToSlug,
  toValidObjectId,
} from "../utils";
import { GetQuestionRequestResponse } from "src/utils/types/GetQuestionRequestResponse";

// TODO: add search/filter in the future
async function getQuestions(
  page: number,
  pageSize: number
): Promise<GetQuestionRequestResponse> {
  if (!page || !pageSize) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_PAGINATION_FIELDS
    );
  }

  const questions: Question[] = await getCollection<Question>("questions")
    .find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();
  const total = await getCollection<Question>("questions").countDocuments();
  return { questions, total };
}

async function getQuestionById(id: string | ObjectId): Promise<Question> {
  const questionObjectId: ObjectId = toValidObjectId(id);

  const question: Question | null = await getCollection<Question>(
    "questions"
  ).findOne({
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
  userId: string | ObjectId,
  data: QuestionRequestBody
): Promise<Question> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const { title, markdown, level, subject }: QuestionRequestBody = data;

  if (!title || !markdown || !level || !subject) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.MISSING_REQUIRED_FIELDS
    );
  }

  const trimmedTitle: string = title.trim();
  const trimmedMarkdown: string = markdown.trim();
  if (trimmedMarkdown === "" || trimmedTitle === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_FIELDS
    );
  }

  const doc: Question = {
    _id: new ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    title: trimmedTitle,
    slug: titleToSlug(trimmedTitle),
    markdown: trimmedMarkdown,
    userId: userObjectId,
    answerIds: [],
    level: level,
    subject: subject,
    upvotes: 0,
    downvotes: 0,
  };

  await getCollection<Question>("questions").insertOne(doc);

  return doc;
}

async function updateQuestion(
  userId: string | ObjectId,
  questionId: string | ObjectId,
  data: QuestionRequestBody
): Promise<Question> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const questionObjectId: ObjectId = toValidObjectId(questionId);
  const { title, markdown, level, subject }: QuestionRequestBody = data;

  if (!title || !markdown || !level || !subject) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.MISSING_REQUIRED_FIELDS
    );
  }

  const trimmedTitle: string = title.trim();
  const trimmedMarkdown: string = markdown.trim();
  if (trimmedTitle === "" || trimmedMarkdown === "") {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_FIELDS
    );
  }

  const result = await getCollection<Question>("questions").findOneAndUpdate(
    {
      _id: questionObjectId,
      userId: userObjectId, // make sure user can only update his own question
    },
    {
      $set: {
        title: trimmedTitle,
        slug: titleToSlug(trimmedTitle),
        markdown: trimmedMarkdown,
        level: level,
        subject: subject,
        updatedAt: new Date(),
        upvotes: 
      },
    },
    { returnOriginal: false }
  );

  const updatedQuestion: Question | undefined = result.value;
  if (updatedQuestion == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return updatedQuestion;
}

async function deleteQuestion(
  userId: string | ObjectId,
  questionId: string | ObjectId
): Promise<boolean> {
  const userObjectId = toValidObjectId(userId);
  const questionObjectId = toValidObjectId(questionId);

  const result = await getCollection<Question>("questions").findOneAndDelete({
    _id: questionObjectId,
    userId: userObjectId, // make sure user can only delete his own question
  });

  const originalQuestion: Question | undefined = result.value;
  const isSuccessful: boolean = originalQuestion != null;
  if (!isSuccessful) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return isSuccessful;
}

async function addAnswerToQuestion(
  questionId: string | ObjectId,
  answerId: string | ObjectId
): Promise<Question> {
  const questionObjectId: ObjectId = toValidObjectId(questionId);
  const answerObjectId: ObjectId = toValidObjectId(answerId);

  const result = await getCollection<Question>("questions").findOneAndUpdate(
    { _id: questionObjectId },
    {
      $addToSet: {
        answerIds: answerObjectId,
      },
    },
    { returnOriginal: false }
  );

  const updatedQuestion: Question | undefined = result.value;
  if (updatedQuestion == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return updatedQuestion;
}

async function removeAnswerFromQuestion(
  answerId: string | ObjectId
): Promise<Question> {
  const answerObjectId: ObjectId = toValidObjectId(answerId);

  const result = await getCollection<Question>("questions").findOneAndUpdate(
    { answerIds: answerObjectId },
    {
      $pull: {
        answerIds: answerObjectId,
      },
    },
    { returnOriginal: false }
  );

  const updatedQuestion: Question | undefined = result.value;
  if (updatedQuestion == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return updatedQuestion;
}

export {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswerToQuestion,
  removeAnswerFromQuestion,
};
