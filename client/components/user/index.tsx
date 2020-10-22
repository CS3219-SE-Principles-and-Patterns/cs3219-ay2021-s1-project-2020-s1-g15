import React, { FC, useState } from "react";
import { Level, User } from "../../utils";
import {
  AlertOutlined,
  DislikeFilled,
  DislikeOutlined,
  LeftOutlined,
  LikeFilled,
  LikeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  PageHeader,
  Row,
  Statistic,
  Layout,
  Divider,
  Tabs,
  List,
  Typography,
  Tag,
  Button,
  Col,
} from "antd";

import styles from "./user.module.css";
import { useRouter } from "next/router";

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

  const renderAnswerWithMarkdown = (markdown: string) => {
    return null; // TODO: fix this
  };

  return (
    <>
      <PageHeader
        title={<h1>User Info</h1>}
        subTitle="viewing user page"
        backIcon={<LeftOutlined className={styles.iconOffset} size={64} />}
        onBack={() => window.history.back()}
      />
      <Content className={styles.mainContent}>
        <Row>
          <h1>{user.email}</h1>
        </Row>
        <Row>
          <Statistic
            title="Questions Asked"
            prefix={<QuestionCircleOutlined />}
            value={user.questionIds.length}
          />
          <Statistic
            title="Answers Given"
            prefix={<AlertOutlined />}
            value={user.answerIds.length}
            style={{
              margin: "0 32px",
            }}
          />
          <Statistic title="Number of Upvotes" prefix="$" value={3345.08} />
        </Row>
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
          <TabPane forceRender tab="Questions" key={userPageTabKeys.questions}>
            <h2>
              <Typography.Text strong>Questions</Typography.Text>
            </h2>
            <List
              bordered
              dataSource={user.questions}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={item.slug}>{item.slug}</a>}
                    description={item.title}
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
                <List.Item>{renderAnswerWithMarkdown(item.markdown)}</List.Item>
              )}
            />
          </TabPane>
          <TabPane forceRender tab="Activity" key={userPageTabKeys.activity}>
            Analytics dashboard
          </TabPane>
        </Tabs>
      </Content>
    </>
  );
};

export default ViewUser;
