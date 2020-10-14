/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {
  AlertOutlined,
  LeftOutlined,
  QuestionCircleFilled,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  Descriptions,
  PageHeader,
  Row,
  Statistic,
  Layout,
  Divider,
  Tabs,
  List,
  Typography,
  Avatar,
  Tag,
} from "antd";

const { TabPane } = Tabs;

import React, { FC } from "react";
import { Level, User } from "../../util";

import styles from "./user.module.css";
import dynamic from "next/dynamic";

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
    if (typeof window !== "undefined") {
      //@ts-ignore
      const ViewRender = dynamic(() =>
        import("../questions/render-markdown-viewer").then(
          (val) => val.RenderMarkdownViewer
        )
      );
      return <ViewRender className={styles.renderAnswer} markdown={markdown} />;
    } else {
      return null;
    }
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
          <h1>{user.username}</h1>
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
