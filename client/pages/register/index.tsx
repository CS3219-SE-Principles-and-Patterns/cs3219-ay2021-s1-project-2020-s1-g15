import FluidPage from "../../components/layout";
import { Card, Form, Input, Button, Spin, notification } from "antd";

import styles from "../login/login.module.css";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { RegisterUserParam, routesObject, GetSingleUserRes } from "../../util";
import Link from "next/link";
import { PageTitle } from "../../util";
import { useForm } from "antd/lib/form/Form";
import { useState } from "react";
import { registerUser } from "../../components/api";
import router from "next/router";
import { useAuth } from "../../components/authentication";

const Register = (): JSX.Element => {
  const [form] = useForm();
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (_) => {
    setLoading(() => true);
    console.log(loading);
    form.validateFields().then(async ({ email, password }) => {
      const createUserArgs: RegisterUserParam = {
        email,
        password,
      };
      try {
        await registerUser(createUserArgs);
        notification.success({
          message: "You have been registered!",
          duration: 2,
        });
        if (login) {
          await login(email, password);
        }
        //router.push(`${routesObject.login}`);
      } catch (err) {
        notification.error({
          message: err.message,
          duration: 2,
        });
      }
      setLoading(false);
    });
  };

  const layout = {};
  return (
    <FluidPage title={PageTitle.REGSITER}>
      <div className={styles.center}>
        <Spin spinning={loading} tip="Loading...">
          <Card className={styles.card}>
            <h1>Register with AnswerLeh</h1>
            <Form
              form={form}
              {...layout}
              className={styles.loginForm}
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
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
        </Spin>
      </div>
    </FluidPage>
  );
};

export default Register;
