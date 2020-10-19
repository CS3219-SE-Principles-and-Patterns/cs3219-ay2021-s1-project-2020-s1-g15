import React, { FC } from "react";
import { GetServerSideProps } from "next";
import { Space, Row, Col } from "antd";
import assert from "assert";

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
  assert(params != null);

  const { qid, slug } = params;
  const question = await getSingleQuestion(qid as string);

  // redirects the user to correct slug if the slug is incorrect
  if (slug !== question.slug) {
    res.writeHead(302, {
      // or 301
      Location: question.slug,
    });
    res.end();
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
