import { motion, useAnimation } from "framer-motion";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useRef } from "react";
import classNames from "../../styles/Home.module.css";

const maximlLabs = [
  "Engaged in Full Stack Development projects, focusing on both front-end and back-end technologies.",
  "Developed dynamic and user-friendly interfaces using HTML, CSS, and JavaScript.",
  "Collaborated with team members to achieve project milestones and ensure code quality",
  "Acquired practical knowledge in version control systems like Git and best practices in software development.",
  "Skills : HTML, CSS, NodeJS, React, Java, Sprinboot.",
  "Strong understanding of version control systems (Git)",
  "Excellent problem-solving and collaboration skills"
];

const orxa = [
  "Skills : Selenium, Java, Cucumber, TestNG, Uipath, Appium, Python, Git, Jenkins, Jira.",
  "Actively contributed to quality assurance and test automation initiatives, resulting in a improvement of overall testing efficiency.",
  "Implemented a Selenium testing framework with Java and Cucumber BDD, leading to a 50% reduction in regression testing time across Y number of projects, ensuring a consistent 95% test coverage.",
  "Stay updated on the latest industry trends and technologies in automation testing through continuous learning initiatives. Like Python, Playwright, WebDriver IO, Cucumber, Appium, UiPath, etc.",
  "Streamlined the testing process by proactively identifying and resolving complex issues, resulting in a 40% reduction in test cycle time and ensures on time product delivery.",
  "Demonstrated a high level of expertise in scripting languages that extend beyond Selenium, encompassing versatile languages such as Python and Java al so Tools like UiPath and Appium. This proficiency has significantly enriched my automation capabilities, allowing for seamless integration and robust automation solutions.",
  "Integrate scripts into CI/CD pipelines to facilitate seamless deployment and validation processes. Proficient in creating comprehensive test reports, documenting test cases, results, and identifying defects throughout the testing lifecycle in Selenium Java."
  ];

function Content4() {
  const lineRef = useRef(null);
  const ballRef = useRef(null);
  const controls = useAnimation();

  const renderPoints = (points) => {
    return points.map((point, index) => {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            // alignItems: "center",
            width: "100%",
          }}
          key={index}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#EC4E39",
              marginRight: 10,
              marginTop: 8,
            }}
          ></div>
          <div
            style={{
              fontSize: 16,
              color: "#fff",
              width: "90%",
            }}
          >
            {point}
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const pulses = gsap
      .timeline({
        defaults: {
          duration: 0.05,
          autoAlpha: 1,
          // scale: 2,
          ease: "elastic(2.5, 1)",
        },
      })
      .to(".ball02", { scale: 2 }, 0.03)
      .to("#maximl-text", {}, 0.03)
      .fromTo(
        "#maximl-container",
        { opacity: 0, x: 30 },
        { opacity: 1, transition: 0.3, x: 0, ease: "elastic(2.5, 1)" },
        0.03
      )
      .to(".ball04", { scale: 2 }, 0.15)
      .to("#orxa-text", {}, 0.15)
      .fromTo(
        "#orxa-container",
        { opacity: 0, x: -30 },
        { opacity: 1, transition: 0.3, x: 0, ease: "elastic(2.5, 1)" },
        0.15
      );

    gsap
      .timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: lineRef.current,
          scrub: true,
          start: "top center",
          end: "bottom center",
          onUpdate: (self) => {
            controls.start({
              pathLength: self.progress,
              transition: { duration: 0 },
            });
            const pathLength = lineRef.current.getTotalLength();
            const position = pathLength * self.progress;
            gsap.set(ballRef.current, {
              visibility: "visible",
              attr: { cy: position },
            });
          },
        },
      })
      .add(pulses, 0);
  }, [controls]);

  return (
    <>
      <div
        style={{
          color: "#fff",
          fontSize: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
        }}
      >
        <div
          style={{
            textTransform: "uppercase",
            fontSize: 10,
            letterSpacing: 6,
            color: "#B7AB8F",
            textAlign: "start",
          }}
        >
          History
        </div>
        <div
          style={{
            fontSize: 34,
            textTransform: "uppercase",
          }}
        >
          Work Experience
        </div>
      </div>
      <div
        style={{
          position: "relative",
          width: "70vw",
          minHeight: "100vh",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "25vh",
        }}
      >
        <motion.svg
          className={classNames.svg}
          id="svg"
          width="700"
          height="1200"
          viewBox="0 0 700 1200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M 0 0 V 1224"
            fill="none"
            stroke="white"
            stroke-width="5"
            initial={{ pathLength: 0 }}
            animate={controls}
            transition={{ duration: 2 }}
            ref={lineRef}
            className={classNames["line"]}
          />
          <motion.circle
            fill={"white"}
            stroke={"white"}
            visibility={"hidden"}
            ref={ballRef}
            r="15"
            cx="50"
            cy="100"
            className={classNames["ball"]}
          />
          <>
            <defs>
              <pattern
                id="image"
                x="0%"
                y="0%"
                height="100%"
                width="100%"
                viewBox="0 0 512 512"
              >
                <image
                  x="-12%"
                  y="0%"
                  xlinkHref="/assets/Cognizant.png"
                  width={"100%"}
                  className={classNames["maximl-logo"]}
                ></image>
              </pattern>
            </defs>
            <motion.circle
              id={classNames["ball"]}
              className="ball02"
              r="20"
              cx="295"
              cy="201"
              visibility={"hidden"}
              fill="url(#image)"
            />
            <motion.text
              y="230"
              stroke={"#ff3333"}
              opacity={0}
              id="maximl-text"
            >
              March 2022 - October 2022
            </motion.text>
          </>
          <>
            <defs>
              <pattern
                id="image1"
                x="0%"
                y="0%"
                height="100%"
                width="100%"
                viewBox="0 0 512 512"
              >
                <image
                  x="-1%"
                  y="4.5%"
                  xlinkHref="/assets/kgisl.png"
                  width={"75%"}
                ></image>
              </pattern>
            </defs>
            <motion.circle
              id={classNames["ball"]}
              className="ball04"
              r="20"
              cx="295"
              cy="950"
              fill="url(#image1)"
              visibility={"hidden"}
            />
            <motion.text
              x="400"
              y="980"
              stroke={"#00e600"}
              opacity={0}
              id="orxa-text"
            >
              December 2022 - Present
            </motion.text>
          </>
        </motion.svg>

        <div
          style={{
            opacity: 0,
          }}
          id="maximl-container"
          className={classNames["maximl-container"]}
        >
          <div className={classNames["chat-bg-left"]}>
            <div className={classNames["chat-text"]}>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontFamily: " DM Sans",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                Full Stack Developer - Internship
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Cognizant Technology Solutions
              </div>
              <div
                style={{
                  padding: 15,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  maxHeight: 280,
                  overflowY: "auto",
                }}
              >
                {renderPoints(maximlLabs)}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            opacity: 0,
          }}
          id="orxa-container"
          className={classNames["orxa-container"]}
        >
          <div className={classNames["chat-bg-right"]}>
            <div className={classNames["chat-text"]}>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontFamily: " DM Sans",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                Automation Test Engineer
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                KGiSL Technologies Pvt Ltd
              </div>
              <div
                style={{
                  padding: 15,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  maxHeight: 280,
                  overflowY: "auto",
                }}
              >
                {renderPoints(orxa)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Content4;
