/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Select,
  Typography,
  Comment,
  Avatar,
  PageHeader,
} from 'antd'
import React, { useRef, useState } from 'react'
import FluidPage from '../layout'
import { pageTitles } from '../../util'
import styles from './question.module.css'
import { Answer, Question } from '../../util/types'
import dynamic from 'next/dynamic'
import {
  DislikeOutlined,
  LikeOutlined,
  PlusCircleFilled,
  DislikeFilled,
  LikeFilled,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

type ViewQuestionProp = {
  question: Question
  answers: Answer[]
}

const ViewQuestion: React.FC<ViewQuestionProp> = ({
  question,
  answers,
}): JSX.Element => {
  //TODO: Handle SEO with this?
  const renderQuestionWithMarkdown = () => {
    if (typeof window !== 'undefined') {
      const ViewRender = dynamic(() =>
        import('./render-markdown-viewer').then(
          (val) => val.RenderMarkdownViewer
        )
      )
      return <ViewRender markdown={question.markdown} />
    } else {
      return null
    }
  }

  const renderCommentWithMarkdown = (markdown: string) => {
    if (typeof window !== 'undefined') {
      const ViewRender = dynamic(() =>
        import('./render-markdown-viewer').then(
          (val) => val.RenderMarkdownViewer
        )
      )
      return <ViewRender markdown={markdown} />
    } else {
      return null
    }
  }
  const action = [
    <Button icon={<LikeFilled />} key="1">
      Upvote
    </Button>,
    <Button icon={<DislikeFilled />} key="2">
      Downvote
    </Button>,
  ]

  return (
    <div className={styles.mainContent}>
      <PageHeader
        title={<h1>Public Question</h1>}
        extra={[
          <Button icon={<LikeFilled />} key="1">
            Upvote
          </Button>,
          <Button icon={<DislikeFilled />} key="2">
            Downvote
          </Button>,
        ]}
      />

      <Card className={styles.shadow}>
        <div>
          <h2>Title</h2>
          <Typography>
            <Title>{question.title}</Title>
            <Paragraph>
              <Text strong>
                Posted by {`${question.userId}`} on {`${question.createdAt}`}
                <br />
              </Text>
              Last edited on {`${question.updatedAt}`}
            </Paragraph>
          </Typography>
          {renderQuestionWithMarkdown()}
          <br />
          <h2>Level: {`${question.level}`}</h2>
          <h2>Subject: {`${question.subject}`}</h2>
        </div>
      </Card>
      <br />
      <Button icon={<PlusCircleFilled />} type="primary">
        Add a Answer
      </Button>
      <br />
      <h1>Answer</h1>
      {answers.map((x: Answer, index: number) => (
        <>
          <Comment
            actions={action}
            author={<a>Reply by user: {x.id}</a>}
            avatar={
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
            }
            content={renderCommentWithMarkdown(x.markdown)}
            key={index}
          ></Comment>
          <Divider />
        </>
      ))}
    </div>
  )
}

export default ViewQuestion
