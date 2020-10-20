import React, { FC } from "react";
import { GetServerSideProps } from "next";
import { Space, Row, Col } from "antd";

import { getSingleQuestion } from "components/api";
import FluidPage from "components/layout";
import { Question, Answer, listOfAnswersMock, menuKeys } from "util/index";
import { ViewQuestion, ViewAnswers } from "components/questions";

type QuestionsProps = {
  question: Question;
  answers: Answer[];
};

const Questions: FC<QuestionsProps> = ({ question, answers }): JSX.Element => {
  return (
    <FluidPage title={question.title} selectedkey={menuKeys.forum}>
      <Row justify="center">
        <Col flex="750px">
          <Space style={{ width: "100%" }} direction="vertical" size="large">
            <ViewQuestion question={question} />
            <ViewAnswers answers={answers} />
          </Space>
        </Col>
      </Row>
    </FluidPage>
  );
};

// SSR: this gets called on every page request
export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const { qid, slug } = params as { qid: string; slug: string };
  const question = await getSingleQuestion(qid);

  // redirects the user to correct slug if the slug is incorrect
  if (slug !== question.slug) {
    res
      .writeHead(302, {
        Location: question.slug,
      })
      .end();
    return { props: {} }; // needed to stop execution of code after
  }

  const answers = JSON.parse(JSON.stringify(listOfAnswersMock)); // TODO: get actual answers

  return {
    props: {
      question: question,
      answers: answers,
    },
  };
};

export default Questions;
