import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ui from "@/styles/site/ui.module.css";
import { easeInOut } from "./primitives";

const words = ["Hello", "வணக்கம்", "नमस्ते", "Bonjour", "Hola", "Ciao", "Olá", "こんにちは", "Hallo"];

export default function Preloader({ onDone }) {
  const [index, setIndex] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index === words.length - 1) {
      const t = setTimeout(onDone, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), index === 0 ? 800 : 150);
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
          <motion.p
            className={ui.preWord}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className={ui.preDot} />
            {words[index]}
          </motion.p>
          <motion.div
            className={ui.preMeta}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
