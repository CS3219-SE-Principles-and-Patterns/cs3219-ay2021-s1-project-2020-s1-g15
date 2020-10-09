import dynamic from "next/dynamic";
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import React from "react";

const AskQuestions = (): JSX.Element => {
  if (typeof window !== "undefined") {
    // client-side-only code
    const AskQuestionsForm = dynamic(
      () => import("../../components/questions/ask-question")
    );
    return <AskQuestionsForm />;
  } else {
    return null;
  }
};

export default AskQuestions;

/**
 * Example hook on checking for SSR-ed

const AskQuestions = (): JSX.Element => {
  const [isComponentMounted, setIsComponentMounted] = useState(false)

  useEffect(() => setIsComponentMounted(true), [])

  if (!isComponentMounted) {
    return null
  }

  if (typeof window !== 'undefined') {
    // client-side-only code
    const AskQuestionsForm = dynamic(
      () => import('../../components/questions/ask-question')
    )
    return <AskQuestionsForm />
  } else {
    return null
  }
}
*/
