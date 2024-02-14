import React from "react";
import styles from "../styles/Stairs.module.css";
import { motion } from "framer-motion";
import { background, height, mountAnim } from "@/common/anim";

function Stairs() {
  return (
    <div className={styles.stairs}>
      {[...Array(5)].map((_, index) => {
        return <Stair key={index} index={index} />;
      })}

      <Background />
    </div>
  );
}

const Stair = ({ index }) => {
  return (
    <motion.div
      variants={height}
      {...mountAnim}
      custom={4 - index}
      className={styles.stair}
    ></motion.div>
  );
};

const Background = () => {
  return (
    <motion.div
      variants={background}
      {...mountAnim}
      className={styles.background}
    ></motion.div>
  );
};
export default Stairs;
