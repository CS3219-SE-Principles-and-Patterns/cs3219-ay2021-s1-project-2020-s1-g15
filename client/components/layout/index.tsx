import React, { FC } from "react";
import router from "next/router";
import Link from "next/link";
import Head from "next/head";
import { Button, Dropdown, Layout, Menu, Row, Typography } from "antd";
import { UserOutlined, LogoutOutlined, DownOutlined } from "@ant-design/icons";

import { useAuth } from "../authentication";
import { Route, NavMenuKey } from "utils/index";

const { Header, Footer, Content } = Layout;
const { Text } = Typography;

type props = {
  children: React.ReactNode;
  title: string;
  selectedkey?: string;
};

const FluidPage: FC<props> = ({ children, title, selectedkey }) => {
  const { logout, user } = useAuth();

  const onLogoutClick = async () => {
    await logout();
    router.push(`${Route.HOME}`);
  };

  const authMenu: JSX.Element = (
    <Menu>
      <Menu.Item>
        <Link href={`/users/${user?.username}`}>
          <span>
            <UserOutlined /> Profile
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item onClick={onLogoutClick}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <Row justify="space-between" align="middle">
            <Row>
              <Text
                style={{
                  color: "white",
                  marginRight: "24px",
                  fontSize: "20px",
                }}
              >
                AnswerLeh
              </Text>
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[selectedkey ?? ""]}
              >
                <Menu.Item key={NavMenuKey.HOME}>
                  <Link href={Route.HOME}>Home</Link>
                </Menu.Item>
                <Menu.Item key={NavMenuKey.FORUM}>
                  <Link href={Route.FORUM}>Forum</Link>
                </Menu.Item>
              </Menu>
            </Row>

            {user ? (
              <Dropdown overlay={authMenu}>
                <Button type="primary">
                  {user.username}
                  <DownOutlined />
                </Button>
              </Dropdown>
            ) : (
              <Button type="primary">
                <Link href={Route.LOGIN}>Login</Link>
              </Button>
            )}
          </Row>
        </Header>

        <Content style={{ padding: "1.5rem", marginTop: 64 }}>
          {children}
        </Content>

        <Footer></Footer>
      </Layout>
    </>
  );
};

export default FluidPage;
