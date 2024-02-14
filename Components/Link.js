import { mountAnim, rotateX } from "@/common/anim";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import styles from "../styles/Link.module.css";

function MenuItem({ data, index, onClose = () => {} }) {
  const { title, description } = data;
  return (
    <motion.div
      variants={rotateX}
      {...mountAnim}
      custom={index}
      className={styles.el}
    >
      <Link
        activeClass="active"
        smooth
        spy
        to={title}
        className={styles.menuItem}
        style={{
          fontSize: 80,
          fontFamily: "sans-serif",
          textTransform: "uppercase",
        }}
        onClick={onClose}
      >
        {title}
      </Link>
    </motion.div>
  );
}

export default MenuItem;
