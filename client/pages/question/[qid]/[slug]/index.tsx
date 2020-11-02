import React, { FC } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Space, Row, Col, PageHeader } from "antd";
import { LeftOutlined } from "@ant-design/icons";

import FluidPage from "components/layout";
import {
  NavMenuKey,
  getSingleQuestion,
  getAnswersOfQuestion,
  GetSingleQuestionRes,
  GetSingleAnswerRes,
  Route,
} from "utils/index";
import { ViewQuestionCard, ViewAnswersCard } from "components/questions";

type QuestionPageProps = {
  question: GetSingleQuestionRes;
  answers: GetSingleAnswerRes[];
};

const QuestionPage: FC<QuestionPageProps> = ({
  question,
  answers,
}): JSX.Element => {
  const router = useRouter();

  return (
    <FluidPage title={question.title} selectedkey={NavMenuKey.FORUM}>
      <Row justify="center">
        <Col flex="750px">
          <PageHeader
            title={<h1>Question</h1>}
            backIcon={
              <LeftOutlined size={64} style={{ marginBottom: "12px" }} />
            }
            onBack={() => router.push(Route.FORUM)}
          />
          <Space style={{ width: "100%" }} direction="vertical" size="large">
            <ViewQuestionCard question={question} />
            <ViewAnswersCard answers={answers} questionId={question._id} />
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

  const answers: GetSingleAnswerRes[] = await getAnswersOfQuestion({
    questionId: qid,
  });

  return {
    props: {
      question: question,
      answers: answers,
    },
  };
};

export default QuestionPage;
