import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import ui from "@/styles/site/ui.module.css";

export const ease = [0.22, 1, 0.36, 1];
export const easeInOut = [0.76, 0, 0.24, 1];

/* Normalises ["plain words", { text: "accent", em: true }] into a flat list of words. */
function toWords(parts) {
  const list = Array.isArray(parts) ? parts : [parts];
  const words = [];
  list.forEach((part, pi) => {
    const { text, em } = typeof part === "string" ? { text: part, em: false } : part;
    text
      .split(" ")
      .filter(Boolean)
      .forEach((w, wi) => words.push({ w, em, key: `${pi}-${wi}` }));
  });
  return words;
}

const plain = (parts) => (Array.isArray(parts) ? parts : [parts]).map((p) => (typeof p === "string" ? p : p.text)).join(" ");

const charVariants = {
  hidden: { y: "108%", rotateX: -85, opacity: 0 },
  show: { y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.05, ease } },
};

/* Characters flip up from behind a per-word mask, one after another.
   Uncontrolled (`play` undefined) it runs when scrolled into view. `stagger` is the per-word pace. */
export function RevealText({ as = "h2", parts, className, delay = 0, play, stagger = 0.055, emClass, ...rest }) {
  const Tag = motion[as];
  const trigger =
    play === undefined
      ? { whileInView: "show", viewport: { once: true, amount: 0.35 } }
      : { animate: play ? "show" : "hidden" };
  return (
    <Tag
      className={className}
      aria-label={plain(parts)}
      initial="hidden"
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger * 0.32, delayChildren: delay } } }}
      {...trigger}
      {...rest}
    >
      {toWords(parts).map(({ w, em, key }) => (
        <span key={key} className={ui.mask} aria-hidden="true">
          <span className={em ? `${ui.emWord} ${emClass || ""}` : ui.word}>
            {Array.from(w).map((c, ci, all) => (
              <motion.span
                key={ci}
                className={em ? `${ui.char} ${ui.emChar}` : ui.char}
                style={em ? { "--i": ci, "--n": all.length } : undefined}
                variants={charVariants}
              >
                {c}
              </motion.span>
            ))}
          </span>
        </span>
      ))}
    </Tag>
  );
}

function ScrollWord({ children, progress, range, em }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={em ? ui.em : undefined}>
      {children}{" "}
    </motion.span>
  );
}

/* Paragraph whose words light up one by one as it scrolls through the viewport. */
export function ScrollText({ parts, className, as = "p" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 52%"] });
  const words = toWords(parts);
  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {words.map(({ w, em, key }, i) => (
        <ScrollWord key={key} em={em} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </ScrollWord>
      ))}
    </Tag>
  );
}

/* Pulls its child toward the pointer; `inner` content drifts a little further for depth. */
export function Magnetic({ children, strength = 0.28, className, style }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 180, damping: 15, mass: 0.35 });
  const y = useSpring(0, { stiffness: 180, damping: 15, mass: 0.35 });
  const onMove = (e) => {
    if (reduce || e.pointerType === "touch") return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block", ...style }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/* Slot-machine digits that roll into place once visible. */
export function Odometer({ value, suffix = "", className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const digits = String(value).split("");
  return (
    <span ref={ref} className={`${ui.odo} ${className || ""}`}>
      <span className={ui.srOnly}>
        {value}
        {suffix}
      </span>
      {digits.map((d, i) => (
        <span key={i} className={ui.odoCol} aria-hidden="true">
          <motion.span
            className={ui.odoStrip}
            initial={{ y: "0%" }}
            animate={{ y: inView ? `-${(Number(d) + 10) * 5}%` : "0%" }}
            transition={{ duration: 1.8 + i * 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.08 * i }}
          >
            {Array.from({ length: 20 }, (_, n) => (
              <span key={n}>{n % 10}</span>
            ))}
          </motion.span>
        </span>
      ))}
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}

/* Counts "150+" up from 0 once visible (and once `start` is true). */
export function CountUp({ value, start = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!target || !inView || !start) return undefined;
    if (reduce) {
      setN(target);
      return undefined;
    }
    const controls = animate(0, target, { duration: 1.8, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, start, reduce, target]);

  if (!match) return <span>{value}</span>;
  return (
    <span ref={ref}>
      {n.toLocaleString("en-US")}
      {match[2]}
    </span>
  );
}

/* Reduced-motion preference for render-time branching: false until mounted, so the first client
   render matches the server HTML (the server can't know the preference). */
export function useReducedMotionAfterMount() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && Boolean(reduce);
}

/* Cycles through phrases with a blur/slide swap. */
export function RotatingWords({ words, interval = 3000 }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotionAfterMount();
  useEffect(() => {
    if (reduce || words.length < 2) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval, reduce]);
  if (reduce) return <span className={`${ui.rotator} ${ui.gradientText}`}>{words[0]}</span>;
  return (
    <span className={ui.rotator}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          className={ui.gradientText}
          initial={{ y: "80%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-80%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function useTypewriter(text, { start = true, speed = 38 } = {}) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!start) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return undefined;
    }
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, start, speed]);
  return out;
}

/* Letters roll up to reveal an accent copy on hover of the closest link/button. */
export function RollText({ text, className }) {
  return (
    <span className={`${ui.roll} ${className || ""}`}>
      <span className={ui.srOnly}>{text}</span>
      <span className={ui.rollInner} aria-hidden="true">
        {text.split("").map((c, i) => (
          <span key={i} style={{ "--i": i }}>
            {c === " " ? " " : c}
          </span>
        ))}
      </span>
    </span>
  );
}

export function useLocalTime(timeZone = "Asia/Kolkata") {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    // 12-hour clock, e.g. "9:24 PM"
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

export function useMediaQuery(query, initial = false) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

/* Tracks pointer position inside an element as --mx / --my for spotlight effects. */
export function useSpotlight() {
  return useCallback((e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
}

/*
  Card hover effect: tilts toward the pointer in 3D and exposes --mx / --my so the `ui.fx` class can
  paint a spotlight and a glowing border that follow the mouse. Mouse only; touch and reduced-motion
  users get the static card.
*/
export function useTilt(max = 6) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 170, damping: 18, mass: 0.4 });
  const rotateY = useSpring(0, { stiffness: 170, damping: 18, mass: 0.4 });
  const onPointerMove = useCallback(
    (e) => {
      if (e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      if (reduce) return;
      rotateY.set((px - 0.5) * max * 2);
      rotateX.set((0.5 - py) * max * 2);
    },
    [max, reduce, rotateX, rotateY]
  );
  const onPointerLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);
  return { style: { rotateX, rotateY, transformPerspective: 1100 }, handlers: { onPointerMove, onPointerLeave } };
}

/* A card with the tilt + spotlight + glow-border hover effect and a reveal on scroll. */
/* Cards arrive from depth: lower, slightly smaller and out of focus, then settle. */
export const cardIn = {
  hidden: { opacity: 0, y: 70, scale: 0.94, filter: "blur(12px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } },
};

export function TiltCard({ as = "div", className = "", children, max = 6, delay = 0, style, ...rest }) {
  const Tag = motion[as];
  const tilt = useTilt(max);
  return (
    <Tag
      className={`${ui.fx} ${className}`}
      style={{ ...tilt.style, ...style }}
      {...tilt.handlers}
      initial={cardIn.hidden}
      whileInView={cardIn.show}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay, ease }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/*
  Section header styled like a spec run: "02  experience.spec.ts ———— ✓ passed",
  then a big masked title and an optional intro.
*/
export function SectionHeader({ index, label, title, intro }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [passed, setPassed] = useState(false);
  useEffect(() => {
    if (!inView) return undefined;
    const t = setTimeout(() => setPassed(true), 900);
    return () => clearTimeout(t);
  }, [inView]);
  const file = `${label.toLowerCase().replace(/\s+/g, "-")}.spec.ts`;
  // Oversized outlined section number drifting behind the header (background only).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], [70, -70]);

  return (
    <header ref={ref} className={ui.sh}>
      <motion.span className={ui.ghost} style={{ y: ghostY }} aria-hidden="true">
        {index}
      </motion.span>
      <motion.div
        className={ui.shTop}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease }}
      >
        <span className={ui.shIndex}>{index}</span>
        <span className={ui.shFile}>{file}</span>
        <span className={ui.shRule} aria-hidden="true" />
        <span className={ui.shStatus} data-passed={passed}>
          {passed ? (
            "✓ passed"
          ) : (
            <>
              <i className={ui.spinner} aria-hidden="true" /> running
            </>
          )}
        </span>
      </motion.div>
      <div className={ui.shBody}>
        <RevealText parts={title} className={ui.shTitle} />
        {intro && (
          <motion.p
            className={ui.shIntro}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
          >
            {intro}
          </motion.p>
        )}
      </div>
    </header>
  );
}

export function ArrowIcon({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
