/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {
  MinusCircleFilled,
  LeftOutlined,
  DislikeOutlined,
  LikeOutlined,
  PlusCircleFilled,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Typography,
  Comment,
  Avatar,
  PageHeader,
  Statistic,
  Row,
  Col,
  Layout,
  Spin,
} from "antd";
import React, { useRef, useState } from "react";
import FluidPage from "../layout";
import { pageTitles } from "../../util";
import styles from "./question.module.css";
import { Answer, Question } from "../../util/types";
import dynamic from "next/dynamic";

import router from "next/router";
import { FC } from "react";
import { useAuth } from "../authentication";
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

type ViewQuestionProp = {
  question: Question;
  answers: Answer[];
};

const ViewQuestion: FC<ViewQuestionProp> = ({
  question,
  answers,
}): JSX.Element => {
  const { user } = useAuth();

  const action = [
    <Button icon={<LikeFilled />} key="1">
      Upvote
    </Button>,
    <Button icon={<DislikeFilled />} key="2">
      Downvote
    </Button>,
  ];

  //TODO: Handle SEO with this?
  //TODO: Need to find a way to meomize these calls.
  // If not every state change will cause this to reload
  // fix now is to encapsulate the state changes into child components. - Eugene
  const renderQuestionWithMarkdown = () => {
    if (typeof window !== "undefined") {
      //@ts-ignore
      const ViewRender = dynamic(() =>
        import("./render-markdown-viewer").then(
          (val) => val.RenderMarkdownViewer
        )
      );
      return <ViewRender markdown={question.markdown} />;
    } else {
      return null;
    }
  };

  const renderCommentWithMarkdown = (markdown: string) => {
    if (typeof window !== "undefined") {
      //@ts-ignore
      const ViewRender = dynamic(() =>
        import("./render-markdown-viewer").then(
          (val) => val.RenderMarkdownViewer
        )
      );
      return <ViewRender markdown={markdown} />;
    } else {
      return null;
    }
  };

  return (
    <div key="view-question2">
      <PageHeaderComponent
        upvotes={question.upvotes}
        downvotes={question.downvotes}
      />

      <div key="view-question" className={styles.mainContent}>
        <Card className={styles.shadow}>
          <div>
            <h2>Title</h2>
            <Typography>
              <Title>{question.title}</Title>
              <Paragraph>
                <Text strong>
                  Posted by {`${question.userId}`} on {`${question.createdAt}`}
                  <br />
                </Text>
                Last edited on {`${question.updatedAt}`}
              </Paragraph>
            </Typography>
            {renderQuestionWithMarkdown()}
            <br />
            <h2>Level: {`${question.level}`}</h2>
            <h2>Subject: {`${question.subject}`}</h2>
          </div>
        </Card>
        <br />
        {<AnswerComponent />}

        <h1>Answer</h1>

        {/*answers.map((x: Answer, index: number) => (
          <div key={index}>
            <Comment
              actions={action}
              author={<a>Reply by user: {x._id}</a>}
              avatar={
                <Avatar
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  alt="Han Solo"
                />
              }
              content={renderCommentWithMarkdown(x.markdown)}
              key={index}
            ></Comment>
            <Divider />
          </div>
            ))*/}
      </div>
    </div>
  );
};

export default ViewQuestion;

type PageHeaderComponent = {
  upvotes: number;
  downvotes: number;
};

const PageHeaderComponent: FC<PageHeaderComponent> = ({
  upvotes,
  downvotes,
}) => {
  const [upvotesLocal, setUpvotes] = useState<number>(upvotes);
  const [downvotesLocal, setDownvotes] = useState<number>(downvotes);
  const onBack = () => {
    if (typeof window !== "undefined") {
      return window.history.back();
    } else {
      return router.push("/forum");
    }
  };

  const upvote = () => {
    setUpvotes(upvotesLocal + 1);
  };
  const downvote = () => {
    setDownvotes(downvotesLocal + 1);
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
      title={<h1>Public Question</h1>}
      backIcon={<LeftOutlined className={styles.iconOffset} size={64} />}
      onBack={onBack}
      extra={action}
    >
      <Content className={styles.mainContent}>
        <Row gutter={16}>
          <Col span={2}>
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

const AnswerComponent: FC = () => {
  const [commentVisible, setCommentVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const renderAnswerEditorWithMarkdown = () => {
    if (typeof window !== "undefined") {
      //@ts-ignore
      const EditorRender = dynamic(() =>
        import("./render-markdown-editor").then(
          (val) => val.RenderMarkdownEditor
        )
      );
      return <EditorRender />;
    } else {
      return null;
    }
  };
  const toggleEditor = async () => {
    setLoading(true);
    setCommentVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      {commentVisible ? (
        <>
          <Button
            className={styles.minusButtonMargin}
            danger={true}
            icon={<MinusCircleFilled />}
            onClick={toggleEditor}
          >
            Stop Answering
          </Button>
          {renderAnswerEditorWithMarkdown()}
        </>
      ) : (
        <Button
          icon={<PlusCircleFilled />}
          type="primary"
          onClick={() => setCommentVisible(true)}
        >
          Add a Answer
        </Button>
      )}
    </Spin>
  );
};
