import React, { FC } from "react";
import {
  AlertOutlined,
  QuestionCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Statistic, Tabs, List, Typography, Row, Col, Divider } from "antd";

import { User, Question, Answer, toLocalisedDate } from "../../utils";
import { QuestionDisplay } from "./QuestionDisplay";
import { AnswerDisplay } from "./AnswerDisplay";

const { TabPane } = Tabs;
const { Text, Paragraph } = Typography;

enum TabKeys {
  STATISTICS = "statistics",
  ACTIVITY = "activity",
  QUESTIONS = "questions",
  ANSWERS = "answers",
}

type ViewUserProps = {
  user: User;
};

const ViewUser: FC<ViewUserProps> = ({ user }) => {
  const questions: Question[] = user.questions?.reverse() ?? [];
  const answers: Answer[] = user.answers?.reverse() ?? [];
  const topVotedQuestion: Question | null =
    user.analytics?.topVotedQuestion ?? null;
  const topVotedAnswer: Answer | null = user.analytics?.topVotedAnswer ?? null;
  const recentlyVotedQuestions: Question[] =
    user.analytics?.recentlyVotedQuestions ?? [];
  const recentlyVotedAnswers: Answer[] =
    user.analytics?.recentlyVotedAnswers ?? [];

  return (
    <Tabs size="large" defaultActiveKey={TabKeys.STATISTICS}>
      <TabPane forceRender tab="Statistics" key={TabKeys.STATISTICS}>
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
        <Paragraph style={{ fontSize: "18px" }} type="secondary">
          Top voted question
        </Paragraph>
        {topVotedQuestion ? (
          <QuestionDisplay question={topVotedQuestion} />
        ) : (
          <Paragraph type="secondary">No question asked yet...</Paragraph>
        )}

        <Divider />
        <Paragraph style={{ fontSize: "18px" }} type="secondary">
          Top voted answer
        </Paragraph>
        {topVotedAnswer ? (
          <AnswerDisplay answer={topVotedAnswer} />
        ) : (
          <Text type="secondary">No answer given yet...</Text>
        )}
      </TabPane>

      <TabPane forceRender tab="Activity" key={TabKeys.ACTIVITY}>
        <Text type="secondary" style={{ fontSize: "18px" }}>
          Recently voted questions
        </Text>
        <List
          dataSource={recentlyVotedQuestions}
          renderItem={(question: Question) => (
            <List.Item>
              <QuestionDisplay question={question} />
            </List.Item>
          )}
        />
        <Divider />
        <Text type="secondary" style={{ fontSize: "18px" }}>
          Recently voted answers
        </Text>
        <List
          dataSource={recentlyVotedAnswers}
          renderItem={(answer: Answer) => (
            <List.Item>
              <AnswerDisplay answer={answer} />
            </List.Item>
          )}
        />
      </TabPane>

      <TabPane forceRender tab="Questions Asked" key={TabKeys.QUESTIONS}>
        <List
          dataSource={questions}
          renderItem={(question: Question) => (
            <List.Item>
              <QuestionDisplay question={question} />
            </List.Item>
          )}
        />
      </TabPane>

      <TabPane forceRender tab="Answers Given" key={TabKeys.ANSWERS}>
        <List
          dataSource={answers}
          renderItem={(answer: Answer) => (
            <List.Item>
              <AnswerDisplay answer={answer} />
            </List.Item>
          )}
        />
      </TabPane>
    </Tabs>
  );
};

export default ViewUser;
