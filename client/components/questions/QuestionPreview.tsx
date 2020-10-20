import React, { FC } from "react";
import { Typography, Space, Tag, Row, Divider } from "antd";
import { grey } from "@ant-design/colors";

import {
  CreateQuestionReq,
  toRelativeTimeAgo,
  markdownToReactNode,
} from "utils/index";

const { Title } = Typography;

type ViewQuestionProp = {
  question: CreateQuestionReq & {
    userId?: string | undefined;
    createdAt?: Date | string | undefined;
  };
};

const QuestionPreview: FC<ViewQuestionProp> = ({ question }): JSX.Element => {
  const { title, userId, createdAt, level, subject, markdown } = question;

  return (
    <>
      <Typography>
        <Title level={1}>{title}</Title>
      </Typography>

      <Space direction="vertical">
        {userId && createdAt ? (
          <Space>
            <span style={{ color: grey[4] }}>{userId}</span>
            <span style={{ color: grey[1] }}>
              {toRelativeTimeAgo(createdAt)}
            </span>
          </Space>
        ) : null}
        <Row>
          <Tag color="geekblue">{level}</Tag>
          <Tag color="geekblue">{subject}</Tag>
        </Row>
      </Space>

      <Divider />

      <article className="markdown-body">
        {markdownToReactNode(markdown)}
      </article>
    </>
  );
};

export default QuestionPreview;
