import React, { FC } from "react";
import { Avatar, Button, Dropdown, Layout, Menu } from "antd";
import styles from "./Layout.module.css";
import Link from "next/link";
import { Route, NavMenuKey } from "utils/index";
import Head from "next/head";
import { useAuth } from "../authentication";
import { UserOutlined, CloseCircleFilled } from "@ant-design/icons";
import router from "next/router";

const { Header, Footer, Content } = Layout;

type props = {
  children: React.ReactNode;
  title: string;
  selectedkey?: string;
};

const FluidPage: FC<props> = ({ children, title, selectedkey }) => {
  const { isAuthenticated, logout, firebaseUser } = useAuth();
  const logoutApplication = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (logout) {
      await logout();
      router.push(`${Route.HOME}`);
    }
  };

  const userMenu = (
    <Menu mode="vertical" className={styles.dropdownMenu}>
      <Menu.Item key={NavMenuKey.USER}>
        <Link href={Route.USER + `${firebaseUser?.uid}`}>
          <Button type="primary">My Page</Button>
        </Link>
      </Menu.Item>
      <Menu.Item key={NavMenuKey.LOGOUT}>
        <Button icon={<CloseCircleFilled />} onClick={logoutApplication}>
          Log Out
        </Button>
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
      <Layout>
        <Header className={styles.header}>
          <div className={styles.logo}>AnswerLeh</div>
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
            <Menu.Item key={NavMenuKey.USER}>
              <Link href={Route.USER}>User</Link>
            </Menu.Item>
            <Menu.Item key={NavMenuKey.LOGIN} className={styles.userProfile}>
              {isAuthenticated ? (
                <Dropdown overlay={userMenu} placement="bottomCenter">
                  <a
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Avatar icon={<UserOutlined />} />
                  </a>
                </Dropdown>
              ) : (
                <Link href={Route.LOGIN}>Login</Link>
              )}
            </Menu.Item>
          </Menu>
        </Header>
        <Content className={styles.content}>{children}</Content>
        <Footer className={styles.footer}></Footer>
      </Layout>
    </>
  );
};

export default FluidPage;
