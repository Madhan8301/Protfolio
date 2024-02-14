import { AnimatePresence } from "framer-motion";
import { forwardRef, useState } from "react";
import styles from "../styles/Header.module.css";
import Magnetic from "./Magnetic";
import Menu from "./Menu";
import Stairs from "./Stairs";

function Header({}, ref) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className={styles.header}>
        <img
          src="../assets/logo.png"
          style={{
            width: 80,
            height: 80,
            objectFit: "contain",
            marginLeft: 20,
          }}
        />
        <Magnetic>
          <div
            className={styles.burger}
            onClick={() => {
              setMenuOpen(true);
            }}
          >
            <div ref={ref} className={styles.bounds}></div>
          </div>
        </Magnetic>
      </div>
      <AnimatePresence mode="wait">
        {menuOpen ? (
          <>
            <Stairs />
            <Menu
              closeMenu={() => {
                setMenuOpen(false);
              }}
            />
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default forwardRef(Header);
