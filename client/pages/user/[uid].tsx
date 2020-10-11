import FluidPage from "../../components/layout";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import ViewUser from "../../components/user";

const User: FC = (): JSX.Element => {
  const router = useRouter();
  const { uid } = router.query;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <FluidPage title="AnswerLeh - User">
      <ViewUser />
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

export default User;
