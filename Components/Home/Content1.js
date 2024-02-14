import useMousePosition from "@/hooks/useMousePosition";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import styles from "../../styles/Home.module.css";

function Content1() {
  const textRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const size = isHovered ? 400 : 40;

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#15171B",
      }}
    >
      <motion.div
        className={styles.mask}
        animate={{
          WebkitMaskPosition: `${x - size / 2}px ${y - size / 2}px`,
          WebkitMaskSize: isHovered ? `${size}px` : 0,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      >
        <p
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
        >
          A skilled Automation Test Engineer responsible for designing and executing automation test 
scenarios, ensures the robustness and reliability of the Life Insurance project
Using Selenium, Java, Cucumber and UiPath.
        </p>
      </motion.div>
      <div className={styles.body}>
        <p>
          I am a skilled and motivated professional with 1 year of experience in 
          <span> Automation Testing </span>, specializing in Selenium, Java, UiPath, Appium, Python, 
          Jenkins, Api and Jira.
        </p>
        
      </div>
    </div>
  );
}

export default Content1;
