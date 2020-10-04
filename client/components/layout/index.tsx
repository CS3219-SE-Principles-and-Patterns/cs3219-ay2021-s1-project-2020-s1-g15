import React, { FC } from 'react'
import { Avatar, Layout, Menu } from 'antd'
import styles from './Layout.module.css'
import Link from 'next/link'
import { routesObject, menuKeys } from '../../util'
import Head from 'next/head'
import { useAuth } from '../authentication'
import { UserOutlined } from '@ant-design/icons'
const { Header, Footer, Content } = Layout

type props = {
  children: React.ReactNode
  title: string
  selectedkey?: string
}

const FluidPage: FC<props> = ({ children, title, selectedkey }) => {
  const { isAuthenticated } = useAuth()
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
          <Menu theme="dark" mode="horizontal" selectedKeys={[selectedkey]}>
            <Menu.Item key={menuKeys.home}>
              <Link href={routesObject.home}>Home</Link>
            </Menu.Item>
            <Menu.Item key={menuKeys.forum}>
              <Link href={routesObject.forum}>Forum</Link>
            </Menu.Item>
            <Menu.Item key={menuKeys.login} className={styles.userProfile}>
              {isAuthenticated ? (
                <Avatar icon={<UserOutlined />} />
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
  )
}

export default FluidPage
