import { Typography, Row, Card, Button } from "antd";
import Link from "next/link";

import FluidPage from "components/layout";
import { PageTitle } from "utils/index";

const { Paragraph, Title } = Typography;

const NotFoundPage = () => {
  return (
    <FluidPage title={PageTitle.NOT_FOUND}>
      <Row style={{ marginTop: "4rem" }} justify="center">
        <Card
          style={{
            width: "100%",
            maxWidth: "500px",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          <Title>404 Error</Title>
          <Paragraph style={{ fontSize: "18px" }}>
            Sorry this page does not exist!
          </Paragraph>
          <Button size="large" type="primary">
            <Link href="/forum">Back to Forum</Link>
          </Button>
        </Card>
      </Row>
    </FluidPage>
  );
};

export default NotFoundPage;
