import React, { useState } from "react";
import router from "next/router";
import Link from "next/link";
import { Card, Form, Input, Button, notification, Typography } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

import FluidPage from "../../components/layout";
import styles from "../login/login.module.css";
import { PageTitle, RegisterUserReq, Route, registerUser } from "../../utils";
import { useAuth } from "../../components/authentication";

const { Title } = Typography;

const RegisterPage = (): JSX.Element => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async ({ username, email, password }: RegisterUserReq) => {
    setLoading(true);
    const createUserArgs: RegisterUserReq = {
      username,
      email,
      password,
    };
    try {
      await registerUser(createUserArgs);
      await login(email, password);
      router.push(Route.HOME);
      notification.success({
        message: "Successfully registered!",
      });
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
    setLoading(false);
  };

  return (
    <FluidPage title={PageTitle.REGSITER}>
      <div className={styles.center}>
        <Card className={styles.card}>
          <Title level={3}>Register with AnswerLeh</Title>
          <Form
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                type="text"
                placeholder="Username"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                type="email"
                placeholder="Email"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item>
              <Button loading={loading} block type="primary" htmlType="submit">
                Sign Up
              </Button>
            </Form.Item>
            <Link href={Route.LOGIN}>Already have an account? Login now!</Link>
          </Form>
        </Card>
      </div>
    </FluidPage>
  );
};

export default RegisterPage;
