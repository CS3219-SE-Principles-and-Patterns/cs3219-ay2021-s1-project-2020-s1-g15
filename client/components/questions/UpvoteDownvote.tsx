import {
  LikeFilled,
  DislikeFilled,
  LeftOutlined,
  LikeOutlined,
  DislikeOutlined,
} from "@ant-design/icons";
import { Button, PageHeader, Row, Col, Statistic, Layout } from "antd";
import { useAuth } from "components/authentication";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { checkVoteQuestion, downvoteQuestion, upvoteQuestion } from "utils";
import { useUpvoteDownvote } from "utils/hooks";
import styles from "./index.module.css";

const { Content } = Layout;

type PageHeaderComponent = {
  qid: string;
  title: string;
  upvotes: number;
  downvotes: number;
};
const QuestionUpvoteDownvote: FC<PageHeaderComponent> = ({
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
    upvotes,
    downvotes,
    qid,
    checkVoteStatus: checkVoteQuestion,
    upvoteAPIRequest: upvoteQuestion,
    downvoteAPIRequest: downvoteQuestion,
  });

  const onBack = () => {
    if (typeof window !== "undefined") {
      return window.history.back();
    } else {
      return router.push("/forum");
    }
  };

  const upvote = async () => await downvoteOnClick();
  const downvote = async () => await upvoteOnClick();

  const action = [
    <Button icon={<LikeFilled />} key="1" onClick={upvote}>
      Upvote
    </Button>,
    <Button icon={<DislikeFilled />} key="2" onClick={downvote}>
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
