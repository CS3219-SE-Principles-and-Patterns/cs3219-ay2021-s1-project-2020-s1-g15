/* eslint-disable @typescript-eslint/camelcase */
import React, { FC } from 'react'
import styles from './landing.module.css'
import Particles from 'react-tsparticles'
import { Typography, PageHeader, Button, Divider, Card } from 'antd'

const { Paragraph, Title, Text } = Typography

const LandingPage: FC = () => {
  return (
    <>
      <div className={styles.hero}>
        <Particles
          id="tsparticles"
          height="50vh"
          className={styles.particle}
          options={{
            background: {
              color: {
                value: '#001529',
              },
            },
            fpsLimit: 60,
            interactivity: {
              detectsOn: 'canvas',
              events: {
                onClick: {
                  enable: true,
                  mode: 'push',
                },
                onHover: {
                  enable: true,
                  mode: 'repulse',
                },
                resize: true,
              },
              modes: {
                bubble: {
                  distance: 300,
                  duration: 2,
                  opacity: 0.8,
                  size: 30,
                },
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: '#ffffff',
              },
              links: {
                color: '#ffffff',
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: 'none',
                enable: true,
                outMode: 'bounce',
                random: false,
                speed: 6,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  value_area: 200,
                },
                value: 20,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: 'circle',
              },
              size: {
                random: true,
                value: 5,
              },
            },
            detectRetina: true,
          }}
        ></Particles>
        <div className={styles.title}>
          <h1 className={styles.titleColor}>AnswerLeh</h1>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.content}>
          <div className={styles.firstSection}>
            <div className={styles.pitchBox}>
              <div
                className={`${styles.alignCenter} ${styles.headerText}`}
              ></div>
            </div>
          </div>

          <div className={styles.introColumn}>
            <Divider />
            <Typography className={styles.alignCenter}>
              <Title level={2}>
                Lorem iptsum
                <br />
                <Text type="secondary"> Lorem iptsum</Text>
              </Title>
            </Typography>
          </div>

          <div className={styles.infoColumn}>
            <div className={`${styles.box}`}>
              <Typography>
                <div style={{ display: 'flex' }}>
                  <Title>Lorem iptsum</Title>
                </div>
              </Typography>
            </div>
            <div className={`${styles.box} ${styles.boxTask}`}>
              {' '}
              <Typography>
                <div style={{ display: 'flex' }}>
                  <Title>Lorem iptsum</Title>
                </div>
              </Typography>
            </div>
            <div className={`${styles.box} ${styles.boxOffer}`}>
              {' '}
              <Typography>
                <div style={{ display: 'flex' }}>
                  <Title>Lorem iptsum</Title>
                </div>
              </Typography>
            </div>
          </div>

          <div className={styles.firstSection}>
            <div className={styles.pitchBox}>
              <Divider />
              <Typography className={styles.alignCenter}>
                <Paragraph>
                  <h3>Brought to you by</h3>
                </Paragraph>
              </Typography>
            </div>
          </div>
          <div className={styles.infoColumnDev}>
            <div className={styles.box}>
              <Typography>Lorem iptsum</Typography>
            </div>
            <div className={styles.box}>
              <Typography>Lorem iptsum</Typography>
            </div>
            <div className={styles.box}>
              <Typography>Lorem iptsum</Typography>
            </div>
          </div>
          <div className={styles.introColumn}>
            <Divider />
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingPage
