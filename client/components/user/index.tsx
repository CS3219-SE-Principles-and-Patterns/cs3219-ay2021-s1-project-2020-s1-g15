import React, { FC } from "react";
import { Level, markdownToReactNode, Route, User } from "../../utils";
import {
  AlertOutlined,
  LeftOutlined,
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
  Space,
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
        title={<h1>User Info</h1>}
        subTitle="viewing user page"
        backIcon={<LeftOutlined className={styles.iconOffset} size={64} />}
        onBack={() => window.history.back()}
      />
      <Space style={{ width: "100%" }} direction="vertical" size="large">
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
            <Statistic title="Number of Upvotes" prefix="$" value={"0"} />
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
              Analytics dashboard
            </TabPane>
          </Tabs>
        </Content>
      </Space>
    </>
  );
};

export default ViewUser;
