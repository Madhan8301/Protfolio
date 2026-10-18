import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ui from "@/styles/site/ui.module.css";
import { easeInOut } from "./primitives";

const words = ["Hello", "வணக்கம்", "नमस्ते", "Bonjour", "Hola", "Ciao", "Olá", "こんにちは", "Hallo"];

// First word holds 800ms, the rest flick by every 150ms, the last one holds 650ms.
const FIRST = 800;
const STEP = 150;
const LAST = 650;
const TOTAL = FIRST + (words.length - 2) * STEP + LAST;

const soft = [0.22, 1, 0.36, 1];

export default function Preloader({ onDone }) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index === words.length - 1) {
      const t = setTimeout(onDone, LAST);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), index === 0 ? FIRST : STEP);
    return () => clearTimeout(t);
  }, [index, onDone]);

  const { width: w, height: h } = size;
  const curve = {
    initial: { d: `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 300} 0 ${h} L0 0` },
    exit: {
      d: `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`,
      transition: { duration: 0.7, ease: easeInOut, delay: 0.3 },
    },
  };

  return (
    <motion.div
      className={ui.preloader}
      initial={{ top: 0 }}
      exit={{ top: "-100vh", transition: { duration: 0.8, ease: easeInOut, delay: 0.2 } }}
      aria-label="Loading"
      role="status"
    >
      {w > 0 && (
        <>
          {/* One soft glow behind the word */}
          <motion.div
            className={ui.preGlow}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 1.8, ease: soft }}
          />

          <motion.div
            className={ui.preCenter}
            exit={{ opacity: 0, y: -24, filter: "blur(10px)", transition: { duration: 0.45, ease: easeInOut } }}
          >
            <p className={ui.preWord}>
              <span className={ui.preDot} />
              <span className={ui.preMask}>
                <motion.span
                  key={index}
                  className={ui.preText}
                  initial={{ y: index === 0 ? "60%" : "35%", opacity: 0, filter: "blur(8px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: index === 0 ? 0.9 : 0.16, delay: index === 0 ? 0.1 : 0, ease: soft }}
                >
                  {words[index]}
                </motion.span>
              </span>
            </p>
            {/* A single thin line that fills while the site loads */}
            <span className={ui.preLine} aria-hidden="true">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: (TOTAL - 200) / 1000, ease: [0.65, 0, 0.35, 1] }}
              />
            </span>
          </motion.div>

          <motion.div
            className={ui.preMeta}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            <span>Madhan Kumar M</span>
            <span>Automation Test Engineer</span>
            <span suppressHydrationWarning>Portfolio ©{new Date().getFullYear()}</span>
          </motion.div>
          <svg className={ui.preSvg} aria-hidden="true">
            <motion.path variants={curve} initial="initial" exit="exit" />
          </svg>
        </>
      )}
    </motion.div>
  );
}
