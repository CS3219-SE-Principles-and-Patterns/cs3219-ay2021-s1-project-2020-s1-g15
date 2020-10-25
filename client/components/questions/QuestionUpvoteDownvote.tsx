import React, { FC } from "react";
import { useRouter } from "next/router";
import { Button, PageHeader, Row, Col, Statistic, Layout } from "antd";
import {
  LikeFilled,
  DislikeFilled,
  LeftOutlined,
  LikeOutlined,
  DislikeOutlined,
} from "@ant-design/icons";

import styles from "./index.module.css";
import { useAuth } from "components/authentication";
import { useUpvoteDownvote } from "utils";

const { Content } = Layout;

type QuestionUpvoteDownvoteProps = {
  qid: string;
  title: string;
  upvotes: number;
  downvotes: number;
};

const QuestionUpvoteDownvote: FC<QuestionUpvoteDownvoteProps> = ({
  qid,
  title,
  upvotes,
  downvotes,
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    upvotesLocal,
    downvotesLocal,
    upvoteOnClick,
    downvoteOnClick,
  } = useUpvoteDownvote({
    isQuestionVote: true,
    questionId: qid,
    upvotes,
    downvotes,
  });

  const onBack = () => {
    if (typeof window !== "undefined") {
      return window.history.back();
    } else {
      return router.push("/forum");
    }
  };

  const action = [
    <Button icon={<LikeFilled />} key="1" onClick={upvoteOnClick}>
      Upvote
    </Button>,
    <Button icon={<DislikeFilled />} key="2" onClick={downvoteOnClick}>
      Downvote
    </Button>,
  ];

  return (
    <PageHeader
      title={<h1>{title}</h1>}
      backIcon={<LeftOutlined className={styles.iconOffset} size={64} />}
      onBack={onBack}
      extra={isAuthenticated ? action : null}
    >
      <Content>
        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              key="2"
              title="Upvotes"
              value={`+${upvotesLocal}`}
              prefix={<LikeOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              key="4"
              title="Downvotes"
              value={`-${downvotesLocal}`}
              prefix={<DislikeOutlined />}
            />
          </Col>
        </Row>
      </Content>
    </PageHeader>
  );
};

export { QuestionUpvoteDownvote };
