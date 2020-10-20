import FluidPage from "../../components/layout";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import ViewUser from "../../components/user";
import {
  listOfAnswersMock,
  questionMock,
  User,
  GetSingleUserRes,
} from "../../util";
import { getSingleUser } from "../../components/api";
import { Spin } from "antd";

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
/*
// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  //const res = await fetch(`${process.env.localhost}questions/`)
  //const data = await res.json()
  const data = {};
  // Pass data to the page via props
  return { props: { data } };
}*/
/*
export async function getStaticPaths() {
  // prerender static user page here
  // see https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
  //const allPosts = await getAllPostsWithSlug();

  return {};
}*/

export default UserPage;
