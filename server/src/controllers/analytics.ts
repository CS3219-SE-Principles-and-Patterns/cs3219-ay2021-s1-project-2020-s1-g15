import { ObjectId } from "mongodb";
import { getQuestionsByUserId } from "./questions";
import { analyticsResponse, toValidObjectId } from "../utils";
import { getAnswersByUserId } from "./answers";
import { Question, Answer } from "../models";
//GET request
async function getAnalyticsbyUserId(
  id: string | ObjectId
): Promise<analyticsResponse> {
  const userObjectId: ObjectId = toValidObjectId(id);
  const questions: Question[] = await getQuestionsByUserId(userObjectId);
  const answers: Answer[] = await getAnswersByUserId(userObjectId);
  //To get Total number of questions asked
  const numQuestions: number = questions.length;

  //To get Total number of questions answered
  const numAnswers: number = answers.length;

  //To get Ratio of questions asked to questions answered
  const ratioQA: number = numQuestions / numAnswers;

  //To get Total number of upvotes (of all questions asked/answered)
  let numUpvotes = 0;
  for (const question of questions) {
    numUpvotes = numUpvotes + question.upvotes;
  }
  for (const answer of answers) {
    numUpvotes = numUpvotes + answer.upvotes;
  }

  //To get Total number of downvotes (of all questions asked/answered)
  let numDownpvotes = 0;
  for (const question of questions) {
    numDownpvotes = numDownpvotes + question.downvotes;
  }
  for (const answer of answers) {
    numDownpvotes = numDownpvotes + answer.downvotes;
  }

  //To get Ratio of upvotes/downvotes
  const ratioUD = numUpvotes / numDownpvotes;

  //To get Top voted answer
  let topAnswer: Answer = answers[0]; //to initialise an initial top answer
  let currenthighestA = 0;
  let netA = 0;
  for (const answer of answers) {
    netA = answer.upvotes - answer.downvotes;
    if (netA > currenthighestA) {
      topAnswer = answer;
      currenthighestA = netA;
    } else continue;
  }

  //To get Top voted question
  let topQuestion: Question = questions[0]; //to initialise an initial top question
  let currenthighestQ = 0;
  let netQ = 0;
  for (const question of questions) {
    netQ = question.upvotes - question.downvotes;
    if (netQ > currenthighestQ) {
      topQuestion = question;
      currenthighestQ = netA;
    } else continue;
  }

  //To gather all different aspects required in the analytics api output
  const [
    totalNumQuestions,
    totalNumAnswers,
    ratioQuestionsToAnswer,
    totalNumUpvotes,
    totalNumDownvotes,
    ratioUpvotesToDownvotes,
    topVotedAnswer,
    topVotedQuestion,
  ] = await Promise.all([
    numQuestions,
    numAnswers,
    ratioQA,
    numUpvotes,
    numDownpvotes,
    ratioUD,
    toValidObjectId(topAnswer._id),
    toValidObjectId(topQuestion._id),
  ]);

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
  };
}

export { getAnalyticsbyUserId };
