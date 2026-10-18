import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import ui from "@/styles/site/ui.module.css";

/*
  Mouse effects (mouse devices only; the native pointer stays visible):
  - a soft green glow that drifts after the pointer across the page,
  - a trailing ring that grows over links/buttons and widens over cards,
  - a small ripple on every click.
*/
export default function MouseFx() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("default");
  const [visible, setVisible] = useState(false);
  const [ripples, setRipples] = useState([]);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.35 });
  const glowX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.8 });
  const glowY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.8 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return undefined;
    setEnabled(true);

    const move = (e) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest("a, button, [role='button'], input, textarea")) setMode("link");
      else if (t?.closest(`.${ui.fx}, [data-card]`)) setMode("card");
      else setMode("default");
    };
    const leave = (e) => {
      if (!e.relatedTarget) setVisible(false);
    };
    let id = 0;
    const click = (e) => {
      if (e.pointerType !== "mouse") return;
      const r = { id: ++id, x: e.clientX, y: e.clientY };
      setRipples((list) => [...list.slice(-4), r]);
      setTimeout(() => setRipples((list) => list.filter((it) => it.id !== r.id)), 700);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", click);
    document.addEventListener("pointerout", leave);
    window.addEventListener("blur", () => setVisible(false));
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
      document.removeEventListener("pointerout", leave);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true">
      <motion.div className={ui.mouseGlow} style={{ x: glowX, y: glowY, opacity: visible ? 1 : 0 }} />
      <motion.div className={ui.mouseRing} style={{ x: ringX, y: ringY }} data-mode={mode} data-visible={visible} />
      <motion.div className={ui.mouseDot} style={{ x, y }} data-visible={visible && mode !== "link"} />
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className={ui.ripple}
            style={{ left: r.x, top: r.y }}
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
