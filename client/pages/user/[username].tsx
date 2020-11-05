import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, Spin, Row, Col } from "antd";

import NotFoundPage from "../404";
import FluidPage from "../../components/layout";
import ViewUser from "../../components/user";
import { User, getSingleUser } from "../../utils";

const UserPage: FC = (): JSX.Element => {
  const router = useRouter();
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const username: string | string[] | undefined = router.query.username;
      if (typeof username !== "string") {
        // to avoid execution when username is undefined
        return;
      }

      try {
        const user = await getSingleUser({ username });
        setUser(user);
      } catch (error) {
        setIsNotFound(true);
      }
    })();
  }, [router.query]);

  return isNotFound ? (
    <NotFoundPage />
  ) : (
    <FluidPage title={`AnswerLeh - ${user?.username}`}>
      {user ? (
        <Row justify="center">
          <Col flex="750px">
            <Card>
              <ViewUser user={user} />
            </Card>
          </Col>
        </Row>
      ) : (
        <Spin size="large" style={{ width: "100%", marginTop: "5rem" }} />
      )}
    </FluidPage>
  );
};

export default UserPage;
