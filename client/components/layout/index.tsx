import { FC } from 'react'
import { Layout, Menu } from 'antd'
import styles from './Layout.module.css'
import Link from 'next/link'
import { routesObject } from '../../util'
import Head from 'next/head'
const { Header, Footer, Content } = Layout

type props = {
  children: React.ReactNode
  title: string
}

const FluidPage: FC<props> = ({ children, title }) => {
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
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1">
              <Link href={routesObject.home}>Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link href={routesObject.login}>Login</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link href={routesObject.forum}>Forum</Link>
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
