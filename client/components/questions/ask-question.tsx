/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { QuestionCircleOutlined, LeftOutlined } from '@ant-design/icons'

import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  PageHeader,
  Select,
  Typography,
} from 'antd'
import React, { useRef, useState } from 'react'
import FluidPage from '../layout'

import { pageTitles } from '../../util'
import styles from './question.module.css'
import { Editor } from '@toast-ui/react-editor'
import { Question } from '../../util/types'

const { Title } = Typography

const { Option } = Select
const subjectOptions = ['test']

const levelOptions = ['Movies', 'Books', 'Music', 'Sports']

type AskQuestionProp = {
  question?: Question | undefined
}

const AskQuestionsForm: React.FC<AskQuestionProp> = ({
  question,
}): JSX.Element => {
  const editor = useRef()

  const [questionLocal, setQuestion] = useState<Question | undefined>(question)
  const [subject, setSubject] = useState<string>(question?.level ?? '')
  const [level, setLevel] = useState<string>(question?.subject ?? '')

  const onFinish = (values) => {
    //console.log('Received values of form: ', values)
    //@ts-ignore
    console.log(editor.current.getInstance().getMarkdown())
  }

  const handleLevel = (value: string) => setLevel(value)
  const handleSubject = (value: string) => setSubject(value)

  const layout = {}
  return (
    <FluidPage title={pageTitles.askQuestion}>
      <PageHeader
        title={
          questionLocal ? (
            <h1>Editing question</h1>
          ) : (
            <h1>Ask a new Public Question</h1>
          )
        }
        backIcon={<LeftOutlined className={styles.iconOffset} size={64} />}
        onBack={() => window.history.back()}
      />
      <div className={styles.mainContent}>
        <Form
          {...layout}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Card className={styles.shadow}>
            <div>
              <h2>Title</h2>
              <h4>
                Be specific and imagine you are asking a question to another
                person
              </h4>
              {questionLocal ? (
                <Typography>
                  <Title>{question.title}</Title>
                </Typography>
              ) : (
                <Form.Item name="username" rules={[]}>
                  <Input
                    prefix={<QuestionCircleOutlined />}
                    placeholder="e.g is there an R function?"
                  />
                </Form.Item>
              )}

              <h2>Body</h2>
              <h4>
                Include all the information someone would need to answer your
                question
              </h4>

              {
                <Editor
                  //@ts-ignore
                  previewStyle="vertical"
                  height="40vh"
                  initialEditType="markdown"
                  initialValue={
                    questionLocal
                      ? questionLocal.markdown
                      : 'Your question here...'
                  }
                  ref={editor}
                />
              }

              <Divider />
              <h2>Level:</h2>
              <h4>
                Select up to 5 tags to describe what your question is about
              </h4>
              <Select
                style={{ width: 120 }}
                onChange={handleLevel}
                value={level}
              >
                {levelOptions.map((x, index) => (
                  <Option key={index} value={x}>
                    {x}
                  </Option>
                ))}
              </Select>
              <Divider />
              <h2>Subject:</h2>
              <h4>
                Select up to 5 tags to describe what your question is about
              </h4>
              <Select
                style={{ width: 120 }}
                onChange={handleSubject}
                value={subject}
              >
                {subjectOptions.map((x, index) => (
                  <Option key={index} value={x}>
                    {x}
                  </Option>
                ))}
              </Select>
            </div>
          </Card>
          <br />
          <Button htmlType="submit" type="primary">
            {questionLocal ? 'Edit Question' : 'Submit Question'}
          </Button>
        </Form>
      </div>
    </FluidPage>
  )
}

export default AskQuestionsForm
