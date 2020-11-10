import { ObjectId } from "mongodb";
import { getQuestionsByUserId, getUnprocessedQuestionById } from "./questions";
import {
  ApiError,
  ApiErrorMessage,
  HttpStatusCode,
  toValidObjectId,
} from "../utils";
import { AnalyticsResponse } from "../utils/types/analyticsTypes";
import { getAnswerById, getAnswersByUserId } from "./answers";
import { Question, Answer, Vote } from "../models";
import { getRecentAnswerVotes, getRecentQuestionVotes } from "./votes";
//GET request
async function getAnalyticsbyUserId(
  id: string | ObjectId
): Promise<AnalyticsResponse> {
  const userObjectId: ObjectId = toValidObjectId(id);
  const questions: Question[] = await getQuestionsByUserId(userObjectId);
  const answers: Answer[] = await getAnswersByUserId(userObjectId);
  //To get Total number of questions asked
  const totalNumQuestions: number = questions.length;

  //To get Total number of questions answered
  const totalNumAnswers: number = answers.length;

  //To get Ratio of questions asked to questions answered
  const ratioQuestionsToAnswer: number = totalNumQuestions / totalNumAnswers;

  //To get Total number of upvotes (of all questions asked/answered)
  let totalNumUpvotes = 0;
  for (const question of questions) {
    totalNumUpvotes = totalNumUpvotes + question.upvotes;
  }
  for (const answer of answers) {
    totalNumUpvotes = totalNumUpvotes + answer.upvotes;
  }

  //To get Total number of downvotes (of all questions asked/answered)
  let totalNumDownvotes = 0;
  for (const question of questions) {
    totalNumDownvotes = totalNumDownvotes + question.downvotes;
  }
  for (const answer of answers) {
    totalNumDownvotes = totalNumDownvotes + answer.downvotes;
  }

  //To get Ratio of upvotes/downvotes
  const ratioUpvotesToDownvotes = totalNumUpvotes / totalNumDownvotes;

  //To get Top voted answer
  let topVotedAnswer: Answer | null;
  if (answers.length == 0) {
    topVotedAnswer = null;
  } else {
    topVotedAnswer = answers[0]; //to initialise an initial top answer
    let currenthighestA = topVotedAnswer.upvotes - topVotedAnswer.downvotes;
    let netA = 0;
    for (const answer of answers) {
      netA = answer.upvotes - answer.downvotes;
      if (netA > currenthighestA) {
        topVotedAnswer = answer;
        currenthighestA = netA;
      } else continue;
    }
  }

  //To get Top voted question
  let topVotedQuestion: Question | null;
  if (questions.length == 0) {
    topVotedQuestion = null;
  } else {
    topVotedQuestion = questions[0]; //to initialise an initial top answer
    let currenthighestQ = topVotedQuestion.upvotes - topVotedQuestion.downvotes;
    let netQ = 0;
    for (const question of questions) {
      netQ = question.upvotes - question.downvotes;
      if (netQ > currenthighestQ) {
        topVotedQuestion = question;
        currenthighestQ = netQ;
      } else continue;
    }
  }

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
    recentlyVotedQuestions.push(
      await getUnprocessedQuestionById(questionObjectId)
    );
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
    recentlyVotedAnswers.push(await getAnswerById(answerObjectId));
  }

  return recentlyVotedAnswers;
}

export { getAnalyticsbyUserId };
