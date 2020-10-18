import React, { FC } from "react";
import { GetServerSideProps } from "next";

import { getSingleQuestion } from "components/api";
import FluidPage from "components/layout";
import { Question, Answer, listOfAnswersMock } from "util/index";
import { ViewQuestion, ViewAnswers } from "components/questions";

type QuestionsProps = {
  question: Question;
  answers: Answer[];
};

const Questions: FC<QuestionsProps> = ({ question, answers }): JSX.Element => {
  return (
    <FluidPage title={question.title}>
      <ViewQuestion question={question} />
      <ViewAnswers answers={answers} />
    </FluidPage>
  );
};

// SSR: this gets called on every page request
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (params == null) {
    return { props: {} };
  }

  const { qid } = params;
  const question = await getSingleQuestion(qid as string);
  const answers = JSON.parse(JSON.stringify(listOfAnswersMock)); // TODO: get actual answers

  return {
    props: {
      question: question,
      answers: answers,
    },
  };
};

export default Questions;
