/* eslint-disable no-console */
import FluidPage from '../../components/layout'
import { Card, Form, Input, Checkbox, Button } from 'antd'
import styles from './login.module.css'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const Login = (): JSX.Element => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values)
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }
  return (
    <FluidPage>
      {
        <Card className={styles.card}>
          <Form
            {...layout}
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
                Log in
              </Button>
              Or <a href="">register now!</a>
            </Form.Item>
          </Form>
        </Card>
      }
    </FluidPage>
  )
}

export default Login
