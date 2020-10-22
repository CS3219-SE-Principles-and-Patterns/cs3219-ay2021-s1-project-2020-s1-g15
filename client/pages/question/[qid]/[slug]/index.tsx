import React, { FC } from "react";
import { GetServerSideProps } from "next";
import { Space, Row, Col } from "antd";

import FluidPage from "components/layout";
import { NavMenuKey, Question, Answer, getSingleQuestion } from "utils/index";
import {
  ViewQuestionCard,
  ViewAnswersCard,
  QuestionUpvoteDownvote,
} from "components/questions";
type QuestionPageProps = {
  question: Question;
  answers: Answer[];
};

const QuestionPage: FC<QuestionPageProps> = ({
  question,
  answers,
}): JSX.Element => {
  return (
    <FluidPage title={question.title} selectedkey={NavMenuKey.FORUM}>
      <Row justify="center">
        <Col flex="750px">
          <Space style={{ width: "100%" }} direction="vertical" size="large">
            <QuestionUpvoteDownvote
              qid={question._id}
              title={question.slug}
              upvotes={question.upvotes}
              downvotes={question.downvotes}
            />
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

  //const answers: Answer[] = await getAnswersOfQuestion({ questionId: qid });

  return {
    props: {
      question: question,
      answers: [],
    },
  };
};

export default QuestionPage;
