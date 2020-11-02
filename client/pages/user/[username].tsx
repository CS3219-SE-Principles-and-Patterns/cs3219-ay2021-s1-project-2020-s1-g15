import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";

import NotFoundPage from "../404";
import FluidPage from "../../components/layout";
import ViewUser from "../../components/user";
import { User, getSingleUser } from "../../utils";

const UserPage: FC = (): JSX.Element => {
  const router = useRouter();
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const username: string | string[] | undefined = router.query.username;
      if (typeof username !== "string") {
        // to avoid execution when username is undefined
        return;
      }

      setLoading(true);
      try {
        const user = await getSingleUser({ username });
        setUser(user);
        setLoading(false);
      } catch (error) {
        setIsNotFound(true);
      }
    })();
  }, [router.query]);

  return isNotFound ? (
    <NotFoundPage />
  ) : (
    <FluidPage title={`AnswerLeh - ${(user as User).username}`}>
      <Spin spinning={loading}>
        <ViewUser user={user as User} />
      </Spin>
    </FluidPage>
  );
};

export default UserPage;
