import { mountAnim, slideLeft } from "@/common/anim";
import { motion } from "framer-motion";
import styles from "../styles/Menu.module.css";
import MenuItem from "./Link";

const menu = [
  {
    title: "About",
    description: "To Know About me",
  },
  {
    title: "Projects",
    description: "To See my Project Details",
  },
  {
    title: "Contact",
    description: "To Contact me",
  },
];

function Menu({ closeMenu = () => {} }) {
  return (
    <div className={styles.menu}>
      <div className={styles.header}>
        <motion.svg
          variants={slideLeft}
          {...mountAnim}
          onClick={closeMenu}
          width="68"
          height="68"
          viewBox="0 0 68 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1.5 1.5L67 67" stroke="white" className={styles.path} />
          <path
            d="M66.5 1L0.999997 66.5"
            stroke="white"
            className={styles.path}
          />
        </motion.svg>
      </div>
      <div className={styles.body}>
        {menu.map((el, index) => {
          return (
            <MenuItem data={el} index={index} key={index} onClose={closeMenu} />
          );
        })}
      </div>
    </div>
  );
}

export default Menu;
