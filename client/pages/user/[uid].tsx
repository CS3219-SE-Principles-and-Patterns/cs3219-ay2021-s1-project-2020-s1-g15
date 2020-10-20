import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";

import FluidPage from "../../components/layout";
import ViewUser from "../../components/user";
import { User, getSingleUser } from "../../utils";

/**
 * A single User Page
 * @params uid: id of user. Sent via url params
 */
const UserPage: FC = (): JSX.Element => {
  const router = useRouter();
  const { uid } = router.query;
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (uid != undefined && uid) {
        try {
          const user: User = await getSingleUser(uid as string);
          console.log(user);
          setUser(user);
        } catch (err) {
          console.log(err);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [uid]);

  return (
    <FluidPage title={`AnswerLeh - ${user?.email ?? "user not found"}`}>
      <Spin spinning={loading}>
        {user ? <ViewUser user={user} /> : <>User not found!</>}
      </Spin>
    </FluidPage>
  );
};

export default UserPage;
