/* eslint-disable no-console */
import FluidPage from '../../components/layout'
import { Card, Form, Input, Checkbox, Button, Divider } from 'antd'

import styles from './login.module.css'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { menuKeys, routesObject } from '../../util'
import Link from 'next/link'
import { pageTitles } from '../../util'
import { useAuth } from '../../components/authentication'

const Login = (): JSX.Element => {
  const { login } = useAuth()
  const onFinish = async ({ username, password }) => {
    await login(username, password)
  }

  return (
    <FluidPage title={pageTitles.login} selectedkey={menuKeys.login}>
      <div className={styles.center}>
        <Card className={styles.card}>
          <h1>Login to AnswerLeh</h1>
          <Form
            name="normal_login"
            className={styles.loginForm}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your Username!' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a className={styles.loginFormForgot} href="">
                Forgot password
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.loginFormButton}
              >
                Login
              </Button>
              Or <Link href={routesObject.register}>register now!</Link>
            </Form.Item>
          </Form>
          <Divider />
          <Button type="primary" className={styles.loginFormButton}>
            Other Log in 1
          </Button>
        </Card>
      </div>
    </FluidPage>
  )
}

export default Login
