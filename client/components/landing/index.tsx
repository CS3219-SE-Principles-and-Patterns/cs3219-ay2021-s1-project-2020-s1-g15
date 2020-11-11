import React, { FC } from "react";
import Particles from "react-tsparticles";
import { Typography, Divider } from "antd";

import styles from "./landing.module.css";

const { Paragraph, Title } = Typography;

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
                value: "#001529",
              },
            },
            fpsLimit: 60,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
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
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 6,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  value_area: 200,
                },
                value: 20,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
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
              <div className={`${styles.alignCenter} ${styles.headerText}`}>
                <Typography>
                  <Title>Welcome to AnswerLeh</Title>
                  <Paragraph type="secondary" style={{ fontSize: "18px" }}>
                    This application was built with Next.js and Express.js with
                    TypeScript and MongoDB
                    <br />
                    (CS3219 AY20/21 semester 1)
                  </Paragraph>
                </Typography>
              </div>
            </div>
          </div>

          <div className={styles.firstSection}>
            <div className={styles.pitchBox}>
              <Divider />
              <Typography className={styles.alignCenter}>
                <Paragraph style={{ fontSize: "25px" }}>
                  Brought to you by
                </Paragraph>
              </Typography>
            </div>
          </div>
          <div className={styles.infoColumnDev}>
            <div className={styles.box}>
              <Paragraph style={{ fontSize: "30px" }}>Eugene Teu</Paragraph>
              Student at National University Of Singapore
            </div>
            <div className={styles.box}>
              <Paragraph style={{ fontSize: "30px" }}>Aaron Choo</Paragraph>
              Student at National University Of Singapore
            </div>
            <div className={styles.box}>
              <Paragraph style={{ fontSize: "30px" }}>Li Zi Ying</Paragraph>
              Student at National University Of Singapore
            </div>
            <div className={styles.box}>
              <Paragraph style={{ fontSize: "30px" }}>Chia Yi You</Paragraph>
              Student at Nanyang Technological University
            </div>
          </div>
          <div className={styles.introColumn}></div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
