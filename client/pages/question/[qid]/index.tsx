import React from "react";
import { GetServerSideProps } from "next";
import assert from "assert";

import { getSingleQuestion } from "components/api";

const DummyNode = (): JSX.Element => {
  return <></>;
};

/**
 * Redirects the user from `/question/[qid]` to the correct `/question/[qid]/[slug]`
 */
export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  assert(params != null);

  const { qid } = params;
  const question = await getSingleQuestion(qid as string);

  // redirects the user to correct slug if the slug is missing
  res.writeHead(302, {
    Location: `${question._id}/${question.slug}`,
  });
  res.end();

  return { props: {} };
};

export default DummyNode;
