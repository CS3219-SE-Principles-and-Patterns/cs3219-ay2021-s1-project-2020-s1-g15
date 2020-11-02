import React, { FC } from "react";
import { Typography, Space, Tag, Row, Divider } from "antd";
import { grey } from "@ant-design/colors";

import {
  toRelativeTimeAgo,
  markdownToReactNode,
  CreateQuestionReq,
  GetSingleQuestionRes,
} from "utils/index";

const { Title } = Typography;

type ViewQuestionProp = {
  question: CreateQuestionReq &
    (Partial<Pick<GetSingleQuestionRes, "user">> & {
      createdAt?: Date | string | undefined;
    });
};

const QuestionPreview: FC<ViewQuestionProp> = ({ question }): JSX.Element => {
  const { title, user, createdAt, level, subject, markdown } = question;

  return (
    <>
      <Typography>
        <Title level={1}>{title}</Title>
      </Typography>

      <Space direction="vertical">
        {user && createdAt ? (
          <Space>
            <span style={{ color: grey[4] }}>{user.username}</span>
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
