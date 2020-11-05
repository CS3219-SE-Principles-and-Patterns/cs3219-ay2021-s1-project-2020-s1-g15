import React from "react";
import { Card, Row, Col, PageHeader } from "antd";

import FluidPage from "components/layout";
import { NavMenuKey, PageTitle } from "utils/index";
import { QuestionForm } from "components/questions";
import { LeftOutlined } from "@ant-design/icons";

const QuestionAskPage = (): JSX.Element => {
  return (
    <FluidPage title={PageTitle.FORUM} selectedkey={NavMenuKey.FORUM}>
      <Row justify="center">
        <Col flex="750px">
          <PageHeader
            title={"Ask a Question"}
            backIcon={<LeftOutlined size={64} />}
            onBack={() => window.history.back()}
          />
          <Card>
            <QuestionForm />
          </Card>
        </Col>
      </Row>
    </FluidPage>
  );
};

export default QuestionAskPage;
