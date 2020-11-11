import { ObjectId } from "mongodb";

import {
  ApiError,
  ApiErrorMessage,
  HttpStatusCode,
  toValidObjectId,
  AnalyticsResponse,
} from "../utils";
import { Question, Answer, Vote } from "../models";
import { getQuestionsByUserId, getUnprocessedQuestionById } from "./questions";
import { getAnswerById, getAnswersByUserId } from "./answers";
import { getRecentAnswerVotes, getRecentQuestionVotes } from "./votes";

async function getAnalyticsbyUserId(
  id: string | ObjectId
): Promise<AnalyticsResponse> {
  const userObjectId: ObjectId = toValidObjectId(id);
  const [questions, answers]: [Question[], Answer[]] = await Promise.all([
    getQuestionsByUserId(userObjectId),
    getAnswersByUserId(userObjectId),
  ]);

  // Total number of questions asked
  const totalNumQuestions: number = questions.length;
  // Total number of questions answered
  const totalNumAnswers: number = answers.length;
  // Ratio of questions asked to questions answered
  const ratioQuestionsToAnswer: number =
    totalNumAnswers === 0
      ? totalNumQuestions
      : totalNumQuestions / totalNumAnswers;

  // total number of upvotes (of all questions asked/answered)
  const totalNumUpvotes =
    questions.reduce((acc, question) => acc + question.upvotes, 0) +
    answers.reduce((acc, answer) => acc + answer.upvotes, 0);
  // total number of downvotes (of all questions asked/answered)
  const totalNumDownvotes =
    questions.reduce((acc, question) => acc + question.downvotes, 0) +
    answers.reduce((acc, answer) => acc + answer.downvotes, 0);
  // ratio of upvotes per downvotes
  const ratioUpvotesToDownvotes =
    totalNumDownvotes === 0
      ? totalNumUpvotes
      : totalNumUpvotes / totalNumDownvotes;

  // most recent top voted question
  const topVotedQuestion: Question | null = questions.reduce<Question | null>(
    (prev: Question | null, curr: Question) =>
      prev === null
        ? curr
        : curr.upvotes - curr.downvotes >= prev.upvotes - prev.downvotes
        ? curr
        : prev,
    null
  );
  // most recent top voted answer
  const topVotedAnswer: Answer | null = answers.reduce<Answer | null>(
    (prev: Answer | null, curr: Answer) =>
      prev === null
        ? curr
        : curr.upvotes - curr.downvotes >= prev.upvotes - prev.downvotes
        ? curr
        : prev,
    null
  );

  // get recently voted questions
  const recentlyVotedQuestions: Question[] = await getRecentlyVotedQuestions(
    userObjectId
  );

  // get recently voted answers
  const recentlyVotedAnswers: Answer[] = await getRecentlyVotedAnswers(
    userObjectId
  );

  //To return the results
  return {
    totalNumQuestions,
    totalNumAnswers,
    ratioQuestionsToAnswer,
    totalNumUpvotes,
    totalNumDownvotes,
    ratioUpvotesToDownvotes,
    topVotedAnswer,
    topVotedQuestion,
    recentlyVotedQuestions,
    recentlyVotedAnswers,
  };
}

async function getRecentlyVotedQuestions(
  userObjectId: ObjectId
): Promise<Question[]> {
  // get 5 most recent question votes
  const recentQuestionVotes: Vote[] = await getRecentQuestionVotes(
    userObjectId
  );

  // create array of questions
  const recentlyVotedQuestions: Question[] = [];

  for (const vote of recentQuestionVotes) {
    if (vote.questionId == null) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        ApiErrorMessage.Question.NOT_FOUND
      );
    }
    const questionObjectId: ObjectId = toValidObjectId(vote.questionId);
    const question: Question | null = await getUnprocessedQuestionById(
      questionObjectId
    );
    if (question != null) {
      recentlyVotedQuestions.push(question);
    }
  }

  return recentlyVotedQuestions;
}

async function getRecentlyVotedAnswers(
  userObjectId: ObjectId
): Promise<Answer[]> {
  // get 5 most recent answer votes
  const recentAnswerVotes: Vote[] = await getRecentAnswerVotes(userObjectId);

  // create array of answers
  const recentlyVotedAnswers: Answer[] = [];

  for (const vote of recentAnswerVotes) {
    if (vote.answerId == null) {
      throw new ApiError(
        HttpStatusCode.NOT_FOUND,
        ApiErrorMessage.Answer.NOT_FOUND
      );
    }
    const answerObjectId: ObjectId = toValidObjectId(vote.answerId);
    const answer: Answer | null = await getAnswerById(answerObjectId);
    if (answer != null) {
      recentlyVotedAnswers.push(answer);
    }
  }

  return recentlyVotedAnswers;
}

export { getAnalyticsbyUserId };
