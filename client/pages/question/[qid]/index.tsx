import React from "react";
import { GetServerSideProps } from "next";

import { getSingleQuestion } from "utils/api";

const DummyNode = (): JSX.Element => {
  return <></>;
};

/**
 * Server side redirect the user from `/question/[qid]` to the correct URL
 * with the correct slug: `/question/[qid]/[slug]`
 */
export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const { qid } = params as { qid: string };
  const question = await getSingleQuestion(qid);

  res
    .writeHead(302, {
      Location: `${question._id}/${question.slug}`,
    })
    .end();

  return { props: {} };
};

export default DummyNode;
