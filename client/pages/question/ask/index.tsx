import React from "react";
import { Card, Row, Col } from "antd";

import FluidPage from "components/layout";
import { menuKeys, PageTitle } from "util/index";
import { QuestionForm } from "components/questions";

const Ask = (): JSX.Element => {
  return (
    <FluidPage title={PageTitle.FORUM} selectedkey={menuKeys.forum}>
      <Row justify="center">
        <Col flex="750px">
          <Card>
            <QuestionForm />
          </Card>
        </Col>
      </Row>
    </FluidPage>
  );
};

export default Ask;
