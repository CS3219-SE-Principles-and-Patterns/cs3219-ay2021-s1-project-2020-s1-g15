/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import React, { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

const AskQuestions = (): JSX.Element => {
  const [isComponentMounted, setIsComponentMounted] = useState(false)

  useEffect(() => setIsComponentMounted(true), [])

  if (!isComponentMounted) {
    return null
  }

  if (typeof window !== 'undefined') {
    // client-side-only code
    const AskQuestionsForm = dynamic(
      () => import('../../components/questions/askQuestionsForm')
    )
    return <AskQuestionsForm />
  } else {
    return null
  }
}

export default AskQuestions
