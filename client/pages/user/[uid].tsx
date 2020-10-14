import FluidPage from "../../components/layout";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import ViewUser from "../../components/user";
import { listOfAnswersMock, questionMock, User } from "../../util";

const UserPage: FC = (): JSX.Element => {
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

  const user: User = {
    email: "Test@gmail.com",
    username: "doombringer45",
    answerIds: ["1231", "1231"],
    questionIds: ["qid", "qid2"],
    answers: listOfAnswersMock,
    questions: [questionMock, questionMock],
  };
  return (
    <FluidPage title={`AnswerLeh - ${user.username}`}>
      <ViewUser user={user} />
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

export default UserPage;
