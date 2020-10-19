import React, { FC, ReactNode } from "react";
import { Typography, Card, Tag, Divider, Space } from "antd";
import { grey } from "@ant-design/colors";

import { Question, markdownToReactNode, toRelativeTimeAgo } from "util/index";

type ViewQuestionProp = {
  question: Question;
};

const { Title } = Typography;

const ViewQuestion: FC<ViewQuestionProp> = ({ question }): JSX.Element => {
  const parsedQuestionNode: ReactNode = markdownToReactNode(question.markdown);

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
        <div>
          <Tag color="geekblue">{question.level}</Tag>
          <Tag color="geekblue">{question.subject}</Tag>
        </div>
      </Space>
      <Divider />
      <article className="markdown-body">{parsedQuestionNode}</article>
    </Card>
  );
};

export { ViewQuestion };
