import React, { FC } from "react";
import Link from "next/link";
import {
  AlertOutlined,
  QuestionCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  Statistic,
  Tabs,
  List,
  Typography,
  Row,
  Col,
  Space,
  Tag,
  Button,
  Divider,
} from "antd";

import {
  markdownToReactNode,
  Route,
  User,
  Question,
  toRelativeTimeAgo,
  Answer,
  toLocalisedDate,
} from "../../utils";

const { TabPane } = Tabs;
const { Text, Paragraph } = Typography;

const userPageTabKeys = {
  statistics: "statistics",
  questions: "questions",
  answers: "answers",
};

type ViewUserProps = {
  user: User;
};

const ViewUser: FC<ViewUserProps> = ({ user }) => {
  const questions: Question[] = user.questions?.reverse() ?? [];
  const answers: Answer[] = user.answers?.reverse() ?? [];
  const topVotedQuestion: Question | null =
    user.analytics?.topVotedQuestion ?? null;
  const topVotedAnswer: Answer | null = user.analytics?.topVotedAnswer ?? null;

  const onChangeTab = (activeKey: string) => {
    console.log(activeKey);
  };

  return (
    <Tabs
      size="large"
      defaultActiveKey={userPageTabKeys.statistics}
      onChange={onChangeTab}
    >
      <TabPane forceRender tab="Statistics" key={userPageTabKeys.statistics}>
        <Row gutter={[32, 16]}>
          <Col>
            <Statistic
              title="Cake day"
              prefix={<CalendarOutlined />}
              value={toLocalisedDate(user.createdAt)}
            />
          </Col>
        </Row>
        <Row gutter={[32, 16]}>
          <Col>
            <Statistic
              title="Questions asked"
              prefix={<QuestionCircleOutlined />}
              value={user.analytics?.totalNumQuestions ?? 0}
            />
          </Col>
          <Col>
            <Statistic
              title="Answers given"
              prefix={<AlertOutlined />}
              value={user.analytics?.totalNumAnswers ?? 0}
            />
          </Col>
          <Col>
            <Statistic
              title="Questions asked per answer given"
              value={user.analytics?.ratioQuestionsToAnswer.toFixed(2) ?? 0}
            />
          </Col>
        </Row>
        <Row gutter={[32, 0]}>
          <Col>
            <Statistic
              title="Total upvotes"
              prefix={<LikeOutlined />}
              value={user.analytics?.totalNumUpvotes ?? 0}
            />
          </Col>
          <Col>
            <Statistic
              title="Total downvotes"
              prefix={<DislikeOutlined />}
              value={user.analytics?.totalNumDownvotes ?? 0}
            />
          </Col>
          <Col>
            <Statistic
              title="Upvotes per downvotes"
              value={user.analytics?.ratioUpvotesToDownvotes.toFixed(2) ?? 0}
            />
          </Col>
        </Row>

        <Divider />
        <Paragraph type="secondary">Top voted question</Paragraph>
        {topVotedQuestion ? (
          <Row style={{ width: "100%" }} justify="space-between" align="middle">
            <Space direction="vertical">
              <Row>
                <Tag>
                  <LikeOutlined /> {topVotedQuestion.upvotes}
                </Tag>
                <Tag>
                  <DislikeOutlined /> {topVotedQuestion.downvotes}
                </Tag>
              </Row>
              <div style={{ fontSize: "20px" }}>{topVotedQuestion.title}</div>
              <Row>
                <Tag color="geekblue">{topVotedQuestion.level}</Tag>
                <Tag color="purple">{topVotedQuestion.subject}</Tag>
              </Row>
              <Text type="secondary">
                {toRelativeTimeAgo(topVotedQuestion.createdAt)},{" "}
                {topVotedQuestion.answerIds.length} answers
              </Text>
            </Space>
            <Button type={"primary"}>
              <Link
                href={`${Route.QUESTION}/[qid]/[slug]`}
                as={Route.QUESTION_VIEW(
                  topVotedQuestion._id,
                  topVotedQuestion.slug
                )}
              >
                View Question
              </Link>
            </Button>
          </Row>
        ) : (
          <Paragraph type="secondary">No question asked yet...</Paragraph>
        )}

        <Divider />
        <Paragraph type="secondary">Top voted answer</Paragraph>
        {topVotedAnswer ? (
          <Row>
            <Space direction="vertical">
              <Row>
                <Tag>
                  <LikeOutlined /> {topVotedAnswer.upvotes}
                </Tag>
                <Tag>
                  <DislikeOutlined /> {topVotedAnswer.downvotes}
                </Tag>
              </Row>
              <article className="markdown-body">
                {markdownToReactNode(topVotedAnswer.markdown)}
              </article>
              <Text type="secondary">
                {toRelativeTimeAgo(topVotedAnswer.createdAt)}
              </Text>
            </Space>
          </Row>
        ) : (
          <Text type="secondary">No answer given yet...</Text>
        )}
      </TabPane>
      <TabPane forceRender tab="Questions" key={userPageTabKeys.questions}>
        <List
          dataSource={questions}
          renderItem={(question: Question) => (
            <List.Item>
              <Row
                style={{ width: "100%" }}
                justify="space-between"
                align="middle"
              >
                <Space direction="vertical">
                  <Row>
                    <Tag>
                      <LikeOutlined /> {question.upvotes}
                    </Tag>
                    <Tag>
                      <DislikeOutlined /> {question.downvotes}
                    </Tag>
                  </Row>
                  <div style={{ fontSize: "20px" }}>{question.title}</div>
                  <Row>
                    <Tag color="geekblue">{question.level}</Tag>
                    <Tag color="purple">{question.subject}</Tag>
                  </Row>
                  <Text type="secondary">
                    {toRelativeTimeAgo(question.createdAt)},{" "}
                    {question.answerIds.length} answers
                  </Text>
                </Space>
                <Button type={"primary"}>
                  <Link
                    href={`${Route.QUESTION}/[qid]/[slug]`}
                    as={Route.QUESTION_VIEW(question._id, question.slug)}
                  >
                    View Question
                  </Link>
                </Button>
              </Row>
            </List.Item>
          )}
        />
      </TabPane>
      <TabPane forceRender tab="Answers" key={userPageTabKeys.answers}>
        <List
          dataSource={answers}
          renderItem={(answer: Answer) => (
            <List.Item>
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
                <Text type="secondary">
                  {toRelativeTimeAgo(answer.createdAt)}
                </Text>
              </Space>
            </List.Item>
          )}
        />
      </TabPane>
    </Tabs>
  );
};

export default ViewUser;
