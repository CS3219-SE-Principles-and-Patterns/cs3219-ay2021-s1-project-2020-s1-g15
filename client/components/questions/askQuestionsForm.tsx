/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { QuestionCircleOutlined } from '@ant-design/icons'

import { Button, Card, Divider, Form, Input, Select } from 'antd'
import React, { useRef, useState } from 'react'
import FluidPage from '../layout'

import { pageTitles } from '../../util'
import styles from './question.module.css'
import { Editor } from '@toast-ui/react-editor'

//TODO: refactor client side checking

const { Option } = Select
const subjectOptions = ['test']

const levelOptions = ['Movies', 'Books', 'Music', 'Sports']

const AskQuestionsForm = (): JSX.Element => {
  const editor = useRef()

  const [subject, setSubject] = useState<string>('')
  const [level, setLevel] = useState<string>('')

  const onFinish = (_) => {
    //console.log('Received values of form: ', values)
    //@ts-ignore
    console.log(editor.current.getInstance().getMarkdown())
  }

  const handleLevel = (value: string) => setLevel(value)
  const handleSubject = (value: string) => setSubject(value)

  const layout = {}
  return (
    <FluidPage title={pageTitles.askQuestion}>
      <div className={styles.mainContent}>
        <h1>Ask a Public Question</h1>
        <Form
          {...layout}
          name="normal_login"
          className={styles.loginForm}
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
              <Form.Item name="username" rules={[]}>
                <Input
                  prefix={<QuestionCircleOutlined />}
                  placeholder="e.g is there an R function?"
                />
              </Form.Item>
              <h2>Body</h2>
              <h4>
                Include all the information someone would need to answer your
                question
              </h4>

              <Editor
                previewStyle="vertical"
                height="40vh"
                initialEditType="markdown"
                initialValue="hello"
                ref={editor}
              />

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
            Submit Question
          </Button>
        </Form>
      </div>
    </FluidPage>
  )
}

export default AskQuestionsForm
