import React from "react";
import { Card, Row, Col } from "antd";

import FluidPage from "components/layout";
import { NavMenuKey, PageTitle } from "utils/index";
import { QuestionForm } from "components/questions";

const Ask = (): JSX.Element => {
  return (
    <FluidPage title={PageTitle.FORUM} selectedkey={NavMenuKey.FORUM}>
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
