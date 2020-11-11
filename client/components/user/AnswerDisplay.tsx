import React, { FC } from "react";
import { Row, Space, Tag, Typography } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";

import { Answer, toRelativeTimeAgo, markdownToReactNode } from "utils";

const { Text } = Typography;

type AnswerDisplayProps = {
  answer: Answer;
};

export const AnswerDisplay: FC<AnswerDisplayProps> = ({ answer }) => {
  return (
    <Space direction="vertical">
      <Row>
        <Tag>
          <LikeOutlined /> {answer.upvotes}
        </Tag>
        <Tag>
          <DislikeOutlined /> {answer.downvotes}
        </Tag>
      </Row>
      <article className="markdown-body">
        {markdownToReactNode(answer.markdown)}
      </article>
      <Text type="secondary">{toRelativeTimeAgo(answer.createdAt)}</Text>
    </Space>
  );
};
