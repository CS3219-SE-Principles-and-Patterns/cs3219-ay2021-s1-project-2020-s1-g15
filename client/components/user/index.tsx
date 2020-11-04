import React, { FC } from "react";
import { Level, markdownToReactNode, Route, User } from "../../utils";
import {
  AlertOutlined,
  LeftOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  PageHeader,
  Statistic,
  Layout,
  Divider,
  Tabs,
  List,
  Typography,
  Tag,
  Space,
  Card,
  Row,
  Col,
} from "antd";

import styles from "./user.module.css";
import Link from "next/link";

const { TabPane } = Tabs;

const userPageTabKeys = {
  questions: "questions",
  answers: "answers",
  activity: "activity",
};

const { Content } = Layout;
type ViewUserProps = {
  user: User;
};

const ViewUser: FC<ViewUserProps> = ({ user }) => {
  const onChangeTab = (activeKey: string) => {
    console.log(activeKey);
  };
  return (
    <>
      <PageHeader
        title={<h1>{user.email}</h1>}
        subTitle="viewing user page"
        backIcon={<LeftOutlined className={styles.iconOffset} size={64} />}
        onBack={() => window.history.back()}
      />
      <Space style={{ width: "100%" }} direction="vertical" size="large">
        <Content className={styles.mainContent}>
          <h2>
            <Typography.Text strong>Top Level</Typography.Text>
          </h2>
          <Row>
            <Tag color="magenta">{Level.JUNIOR_COLLEGE}</Tag>
          </Row>
          <h2>
            <Typography.Text strong>Top Subjects</Typography.Text>
          </h2>
          <Row>
            <Tag color="magenta">{Level.PRIMARY}</Tag>
          </Row>
          <Divider />
          <Tabs
            defaultActiveKey={userPageTabKeys.questions}
            onChange={onChangeTab}
          >
            <TabPane
              forceRender
              tab="Questions"
              key={userPageTabKeys.questions}
            >
              <h2>
                <Typography.Text strong>Questions</Typography.Text>
              </h2>
              <List
                bordered
                dataSource={user.questions}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <>
                          <Link
                            href={`${Route.QUESTION}/[qid]/[slug]`}
                            as={Route.QUESTION_VIEW(item._id, item.slug)}
                          >
                            {item.slug}
                          </Link>
                        </>
                      }
                      description={markdownToReactNode(item.markdown)}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane forceRender tab="Answers" key={userPageTabKeys.answers}>
              <h2>
                <Typography.Text strong>Answers</Typography.Text>
              </h2>
              <List
                bordered
                dataSource={user.answers}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.userId}
                      description={markdownToReactNode(item.markdown)}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane forceRender tab="Activity" key={userPageTabKeys.activity}>
              <Card>
                <Col>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Statistic
                        title="Questions Asked"
                        prefix={<QuestionCircleOutlined />}
                        value={user.analytics?.totalNumQuestions ?? 0}
                      />
                    </Col>
                    <Col>
                      <Statistic
                        title="Answers Given"
                        prefix={<AlertOutlined />}
                        value={user.analytics?.totalNumAnswers ?? 0}
                        style={{
                          margin: "0 32px",
                        }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Statistic
                        title="Number of Upvotes"
                        value={user.analytics?.totalNumUpvotes ?? 0}
                      />
                    </Col>
                    <Col>
                      <Statistic
                        title="Number of Downvotes"
                        value={user.analytics?.totalNumDownvotes ?? 0}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Statistic
                        title="Questions To Answers"
                        value={user.analytics?.ratioQuestionsToAnswer ?? 0}
                      />
                    </Col>
                    <Col>
                      <Statistic
                        title="Upvotes to Downvotes"
                        value={user.analytics?.ratioUpvotesToDownvotes ?? 0}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Statistic
                        title="Top Voted Answer"
                        value={user.analytics?.topVotedAnswer ?? "nil"}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Statistic
                        title="Top Voted Question"
                        value={user.analytics?.ratioQuestionsToAnswer ?? "nil"}
                      />
                    </Col>
                  </Row>
                </Col>
              </Card>
            </TabPane>
          </Tabs>
        </Content>
      </Space>
    </>
  );
};

export default ViewUser;
