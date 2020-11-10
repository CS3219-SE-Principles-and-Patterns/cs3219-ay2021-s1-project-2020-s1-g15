import { ObjectId } from "mongodb";
import { getQuestionsByUserId } from "./questions";
import { toValidObjectId } from "../utils";
import { AnalyticsResponse } from "../utils/types/analyticsTypes";
import { getAnswersByUserId } from "./answers";
import { Question, Answer } from "../models";
import { getRecentlyVotedQuestions } from "./votes";
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
    // recentlyVotedAnswers,
  };
}

export { getAnalyticsbyUserId };
