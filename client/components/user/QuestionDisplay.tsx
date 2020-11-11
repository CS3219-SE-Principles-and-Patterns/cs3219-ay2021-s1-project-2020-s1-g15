import React, { FC } from "react";
import Link from "next/link";
import { Row, Space, Tag, Button, Typography } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";

import { Question, toRelativeTimeAgo, Route } from "utils";

const { Text } = Typography;

type QuestionDisplayProps = {
  question: Question;
};

export const QuestionDisplay: FC<QuestionDisplayProps> = ({ question }) => {
  return (
    <Row style={{ width: "100%" }} justify="space-between" align="middle">
      <Space direction="vertical">
        <Row>
          <Tag>
            <LikeOutlined /> {question.upvotes}
          </Tag>
          <Tag>
            <DislikeOutlined /> {question.downvotes}
          </Tag>
        </Row>
        <div style={{ fontSize: "20px" }}>{question.title}</div>
        <Row>
          <Tag color="geekblue">{question.level}</Tag>
          <Tag color="purple">{question.subject}</Tag>
        </Row>
        <Text type="secondary">
          {toRelativeTimeAgo(question.createdAt)}, {question.answerIds.length}{" "}
          answers
        </Text>
      </Space>
      <Button type={"primary"}>
        <Link
          href={`${Route.QUESTION}/[qid]/[slug]`}
          as={Route.QUESTION_VIEW(question._id, question.slug)}
        >
          View Question
        </Link>
      </Button>
    </Row>
  );
};
