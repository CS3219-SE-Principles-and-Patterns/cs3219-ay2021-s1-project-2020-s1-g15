import React, { FC } from "react";
import Link from "next/link";
import { Typography, Space, Tag, Row, Divider } from "antd";
import { grey } from "@ant-design/colors";

import {
  toRelativeTimeAgo,
  markdownToReactNode,
  CreateQuestionReq,
  GetSingleQuestionRes,
  Route,
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
        <Title level={2}>{title}</Title>
      </Typography>

      <Space direction="vertical">
        <Row>
          <Tag color="geekblue">{level}</Tag>
          <Tag color="purple">{subject}</Tag>
        </Row>
        {user && createdAt ? (
          <Space>
            <Link
              href={`${Route.USER}/[username]`}
              as={`${Route.USER}/${user.username}`}
            >
              {`@${user.username}`}
            </Link>
            <span style={{ color: grey[3] }}>
              {toRelativeTimeAgo(createdAt)}
            </span>
          </Space>
        ) : null}
      </Space>

      <Divider />

      <article className="markdown-body">
        {markdownToReactNode(markdown)}
      </article>
    </>
  );
};

export default QuestionPreview;
