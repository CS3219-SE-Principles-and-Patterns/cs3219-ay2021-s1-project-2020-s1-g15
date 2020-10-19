import React, { FC, ReactNode } from "react";
import { useRouter } from "next/router";
import { Typography, Card, Tag, Divider, Space, Row, Button } from "antd";
import { grey } from "@ant-design/colors";

import {
  Question,
  markdownToReactNode,
  toRelativeTimeAgo,
  routesObject,
} from "util/index";

type ViewQuestionProp = {
  question: Question;
};

const { Title } = Typography;

const ViewQuestion: FC<ViewQuestionProp> = ({ question }): JSX.Element => {
  const router = useRouter();
  const parsedQuestionNode: ReactNode = markdownToReactNode(question.markdown);

  const onEditClick = () => {
    router.push(routesObject.editQuestion(question._id, question.slug));
  };

  const onDeleteClick = () => {
    console.log("delete");
  };

  return (
    <Card>
      <Typography>
        <Title level={1}>{question.title}</Title>
      </Typography>

      <Space direction="vertical">
        <Space>
          <span style={{ color: grey[4] }}>{question.userId}</span>
          <span style={{ color: grey[1] }}>
            {toRelativeTimeAgo(question.createdAt)}
          </span>
        </Space>
        <Row>
          <Tag color="geekblue">{question.level}</Tag>
          <Tag color="geekblue">{question.subject}</Tag>
        </Row>
      </Space>

      <Divider />

      <article className="markdown-body">{parsedQuestionNode}</article>

      <Divider />

      <Row justify="end">
        <Space>
          <Button danger onClick={onDeleteClick}>
            Delete
          </Button>
          <Button type="primary" onClick={onEditClick}>
            Edit
          </Button>
        </Space>
      </Row>
    </Card>
  );
};

export { ViewQuestion };
