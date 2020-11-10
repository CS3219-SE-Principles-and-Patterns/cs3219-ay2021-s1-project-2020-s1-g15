import { FilterQuery, ObjectId } from "mongodb";

import { getQuestionsCollection } from "../services/database";
import { Question } from "../models";
import {
  HttpStatusCode,
  ApiError,
  ApiErrorMessage,
  titleToSlug,
  toValidObjectId,
  GetPaginatedQuestionsResponse,
  GetPaginatedQuestionsRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  VoteIncrementObject,
  Level,
  Subject,
  GetSingleQuestionResponse,
} from "../utils";

async function getQuestions(
  req: GetPaginatedQuestionsRequest
): Promise<GetPaginatedQuestionsResponse> {
  const page = parseInt(req.page || "0");
  const pageSize = parseInt(req.pageSize || "0");
  const sortBy = req.sortBy ?? "recent";
  const { searchText, level, subject } = req;

  if (!page || !pageSize) {
    throw new ApiError(
      HttpStatusCode.BAD_REQUEST,
      ApiErrorMessage.Question.INVALID_PAGINATION_FIELDS
    );
  }

  const query: FilterQuery<GetSingleQuestionResponse> = {};
  if (searchText) {
    query.$text = { $search: searchText.trim() };
  }
  if (level) {
    query.level = level as Level;
  }
  if (subject) {
    query.subject = subject as Subject;
  }
  if (sortBy === "trending" || sortBy === "controversial") {
    const TWO_WEEKS_IN_MS = 1209600000;
    query.createdAt = { $gte: new Date(Date.now() - TWO_WEEKS_IN_MS) };
  }

  const getPaginatedQuestions: Promise<
    GetSingleQuestionResponse[]
  > = getQuestionsCollection()
    .aggregate<GetSingleQuestionResponse>([
      { $match: query },
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
        // sort by more recent first
        $sort:
          sortBy === "recent"
            ? { createdAt: -1 }
            : {
                nettVotes: sortBy === "controversial" ? 1 : -1,
                upvotes: -1,
                createdAt: -1,
              },
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
      {
        // pagination
        $skip: (page - 1) * pageSize,
      },
      {
        // pagination
        $limit: pageSize,
      },
    ])
    .toArray();

  const getQuestionsCollectionSize: Promise<number> = getQuestionsCollection().countDocuments(
    query
  );

  const [questions, total] = await Promise.all([
    getPaginatedQuestions,
    getQuestionsCollectionSize,
  ]);

  return { questions, total };
}

async function getQuestionById(
  id: string | ObjectId
): Promise<GetSingleQuestionResponse> {
  const questionObjectId: ObjectId = toValidObjectId(id);

  const result: GetSingleQuestionResponse[] = await getQuestionsCollection()
    .aggregate<GetSingleQuestionResponse>([
      {
        // match only the questionObjectId
        $match: { _id: questionObjectId },
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
        // exclude certain fields
        $project: {
          userId: false,
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

  const question: GetSingleQuestionResponse | null = result[0];
  if (question == null) {
    throw new ApiError(
      HttpStatusCode.NOT_FOUND,
      ApiErrorMessage.Question.NOT_FOUND
    );
  }

  return question;
}

async function getQuestionsByUserId(
  userId: string | ObjectId
): Promise<Question[]> {
  const userObjectId: ObjectId = toValidObjectId(userId);

  const questions: Question[] = await getQuestionsCollection()
    .find({
      userId: userObjectId,
    })
    .toArray();

  return questions;
}

async function createQuestion(
  userId: string | ObjectId,
  data: CreateQuestionRequest
): Promise<Question> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const { title, markdown, level, subject }: CreateQuestionRequest = data;

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

  await getQuestionsCollection().insertOne(doc);

  return doc;
}

async function updateQuestion(
  userId: string | ObjectId,
  questionId: string | ObjectId,
  data: UpdateQuestionRequest
): Promise<Question> {
  const userObjectId: ObjectId = toValidObjectId(userId);
  const questionObjectId: ObjectId = toValidObjectId(questionId);
  const { title, markdown, level, subject }: UpdateQuestionRequest = data;

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

  const result = await getQuestionsCollection().findOneAndUpdate(
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

async function updateQuestionVotes(
  questionId: string | ObjectId,
  voteIncrementObject: VoteIncrementObject
): Promise<Question> {
  const questionObjectId: ObjectId = toValidObjectId(questionId);

  const result = await getQuestionsCollection().findOneAndUpdate(
    {
      _id: questionObjectId,
    },
    {
      $inc: voteIncrementObject,
    },
    { returnOriginal: false }
  );

  const updatedQuestion: Question | undefined = result.value;
  if (updatedQuestion == null) {
    //TODO: remove vote created if not found
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

  const result = await getQuestionsCollection().findOneAndDelete({
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

  const result = await getQuestionsCollection().findOneAndUpdate(
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

  const result = await getQuestionsCollection().findOneAndUpdate(
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
  getQuestionsByUserId,
  createQuestion,
  updateQuestion,
  updateQuestionVotes,
  deleteQuestion,
  addAnswerToQuestion,
  removeAnswerFromQuestion,
};
