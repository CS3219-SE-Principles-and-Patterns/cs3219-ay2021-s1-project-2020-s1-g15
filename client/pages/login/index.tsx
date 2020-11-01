import { useState } from "react";
import router from "next/router";
import Link from "next/link";
import {
  Card,
  Form,
  Input,
  Checkbox,
  Button,
  Typography,
  notification,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

import styles from "./login.module.css";
import { NavMenuKey, Route, PageTitle } from "../../utils";
import { useAuth } from "../../components/authentication";
import FluidPage from "../../components/layout";

const { Title } = Typography;

const LoginPage = (): JSX.Element => {
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
      router.push(Route.HOME);
    } catch (err) {
      notification.error({
        message: err.message,
      });
    }
    setLoading(false);
  };

  return (
    <FluidPage title={PageTitle.LOGIN} selectedkey={NavMenuKey.LOGIN}>
      <div className={styles.center}>
        <Card className={styles.card}>
          <Title level={3}>Login to AnswerLeh</Title>
          <Form initialValues={{ remember: true }} onFinish={onFinish}>
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
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox disabled={loading}>Remember me</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button loading={loading} block type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
            <Link href={Route.REGISTER}>Need an account? Register now!</Link>
          </Form>
        </Card>
      </div>
    </FluidPage>
  );
};

export default LoginPage;
