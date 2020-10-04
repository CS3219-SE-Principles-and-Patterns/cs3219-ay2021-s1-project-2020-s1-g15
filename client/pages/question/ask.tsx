/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserOutlined } from '@ant-design/icons'
/* eslint-disable no-console */
import { Button, Card, Form, Input, Tag } from 'antd'
import React, { useRef, useState } from 'react'
import FluidPage from '../../components/layout'

import { pageTitles } from '../../util'
import styles from './question.module.css'

import dynamic from 'next/dynamic'
/*
import MarkdownIt from 'markdown-it'
import * as ReactMarkdown from 'react-markdown'*/

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
})
/*
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
})
const mdParser = new MarkdownIt()
*/

const { CheckableTag } = Tag

const tagsData = ['Movies', 'Books', 'Music', 'Sports']

const AskQuestions = (): JSX.Element => {
  const [selectedTags, setSelectedTags] = useState([])

  const editor = useRef(null)
  const [content, setContent] = useState('')

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  }

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag)
    console.log('You are interested in: ', nextSelectedTags)
    setSelectedTags(nextSelectedTags)
  }

  const onFinish = (values) => {
    console.log('Received values of form: ', values)
  }

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
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="e.g is there an R function?"
                />
              </Form.Item>
              <h2>Body</h2>
              <h4>
                Include all the information someone would need to answer your
                question
              </h4>
              <JoditEditor
                ref={editor}
                value={content}
                //@ts-ignore
                config={config}
                tabIndex={1} // tabIndex of textarea
                // fix for type error here
                //@ts-ignore
                onBlur={(newContent) => setContent(newContent.target.innerHTML)}
                // preferred to use only this option to update the content for performance reasons
              />
              <h2>Category:</h2>
              <h4>
                Select up to 5 tags to describe what your question is about
              </h4>
              {tagsData.map((tag) => (
                <CheckableTag
                  className={styles.tag}
                  key={tag}
                  checked={selectedTags.indexOf(tag) > -1}
                  onChange={(checked) => handleChange(tag, checked)}
                >
                  {tag}
                </CheckableTag>
              ))}
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

export default AskQuestions
