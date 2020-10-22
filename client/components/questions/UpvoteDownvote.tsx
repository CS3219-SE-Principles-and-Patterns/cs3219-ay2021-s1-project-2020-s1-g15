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
import React, { FC, useEffect, useState } from "react";
import {
  checkVoteQuestion,
  downvoteQuestion,
  upvoteQuestion,
  VOTE_CMD,
} from "utils";
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
  const { isAuthenticated, getIdToken } = useAuth();
  const router = useRouter();

  const [upvotesLocal, setUpvotes] = useState<number>(upvotes);
  const [idToken, setIdToken] = useState<string | undefined>(undefined);
  const [downvotesLocal, setDownvotes] = useState<number>(downvotes);
  const [hasUpVoted, setHasUpVoted] = useState<boolean>(false);
  const [hasDownVoted, setHasDownVoted] = useState<boolean>(false);
  const onBack = () => {
    if (typeof window !== "undefined") {
      return window.history.back();
    } else {
      return router.push("/forum");
    }
  };

  useEffect(() => {
    const runChecks = async () => {
      const userIdToken = await getIdToken();

      const { isUpvote, isDownvote } = await checkVoteQuestion(
        userIdToken,
        qid
      );
      if (isUpvote) {
        setHasUpVoted(true);
      }

      if (isDownvote) {
        setHasDownVoted(true);
      }
      setIdToken(userIdToken);
    };
    runChecks();
  }, [getIdToken, qid]);

  const upvote = async () => {
    if (hasUpVoted && idToken) {
      const question = await upvoteQuestion(idToken, qid, VOTE_CMD.remove);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpVoted(false);
      setHasDownVoted(false);
    } else if (idToken) {
      const question = await upvoteQuestion(idToken, qid, VOTE_CMD.insert);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpVoted(true);
      setHasDownVoted(false);
    }
  };
  const downvote = async () => {
    if (hasDownVoted && idToken) {
      const question = await downvoteQuestion(idToken, qid, VOTE_CMD.remove);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpVoted(false);
      setHasDownVoted(false);
    } else if (idToken) {
      const question = await downvoteQuestion(idToken, qid, VOTE_CMD.insert);
      setUpvotes(question.upvotes);
      setDownvotes(question.downvotes);
      setHasUpVoted(false);
      setHasDownVoted(true);
    }
  };

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
