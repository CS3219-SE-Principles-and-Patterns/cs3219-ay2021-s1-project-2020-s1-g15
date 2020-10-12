import FluidPage from "../../components/layout";
import { Card, Form, Input, Button } from "antd";

import styles from "../login/login.module.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { routesObject } from "../../util";
import Link from "next/link";
import { pageTitles } from "../../util";

const Register = (): JSX.Element => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const layout = {};
  return (
    <FluidPage title={pageTitles.register}>
      <div className={styles.center}>
        <Card className={styles.card}>
          <h1>Register with AnswerLeh</h1>
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
                { required: true, message: "Please input your Username!" },
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
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.loginFormButton}
              >
                Sign Up
              </Button>
              Or <Link href={routesObject.login}>login!</Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </FluidPage>
  );
};

export default Register;
