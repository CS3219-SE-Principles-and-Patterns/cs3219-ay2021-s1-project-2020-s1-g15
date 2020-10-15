import React, { FC } from "react";
import { Avatar, Button, Dropdown, Layout, Menu } from "antd";
import styles from "./Layout.module.css";
import Link from "next/link";
import { routesObject, menuKeys } from "../../util";
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
      router.push(`${routesObject.home}`);
    }
  };

  const userMenu = (
    <Menu mode="vertical" className={styles.dropdownMenu}>
      <Menu.Item key={menuKeys.user}>
        <Link href={routesObject.user + `${firebaseUser?.uid}`}>
          <Button type="primary">My Page</Button>
        </Link>
      </Menu.Item>
      <Menu.Item key={menuKeys.logout}>
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
            <Menu.Item key={menuKeys.home}>
              <Link href={routesObject.home}>Home</Link>
            </Menu.Item>
            <Menu.Item key={menuKeys.forum}>
              <Link href={routesObject.forum}>Forum</Link>
            </Menu.Item>
            <Menu.Item key={menuKeys.user}>
              <Link href={routesObject.user}>User</Link>
            </Menu.Item>
            <Menu.Item key={menuKeys.login} className={styles.userProfile}>
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
                <Link href={routesObject.login}>Login</Link>
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
