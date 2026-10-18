import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { experience, profile, stats } from "@/data/portfolio";
import s from "@/styles/site/Hero.module.css";
import ui from "@/styles/site/ui.module.css";
import { ArrowIcon, CountUp, Magnetic, RotatingWords, ease, useSpotlight, useTilt, useTypewriter } from "./primitives";

const current = experience.find((job) => job.current);

const COMMAND = "npx playwright test madhan.spec.js";
const checks = [
  ["4+ years of test automation", "1.2s"],
  ["Playwright · Selenium · Appium", "0.8s"],
  ["Keyword & data-driven frameworks", "0.9s"],
  ["CI/CD with Jenkins", "0.4s"],
  [`Shipping quality @ ${current.company}`, "0.3s"],
];
const rotating = ["boringly reliable.", "fast & flake-free.", "automated end-to-end.", "ready to ship."];

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, delay, ease } }),
};

/*
  The name: letters flip up one by one, then react to the pointer — letters near it lift and thin out
  (Space Grotesk is a variable font, 300–700). `x1`/`x2` are scroll-linked offsets for the two lines.
*/
const nameChar = {
  hidden: { y: "105%", rotateX: -90, opacity: 0 },
  show: (i) => ({ y: "0%", rotateX: 0, opacity: 1, transition: { duration: 1.2, delay: 0.15 + i * 0.045, ease } }),
};

function HeroName({ ready, x1, x2 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return undefined;
    const chars = Array.from(el.querySelectorAll("[data-c]"));
    const val = chars.map(() => 0);
    const R = 230;
    let mx = -1e4;
    let my = -1e4;
    let raf = 0;
    const tick = () => {
      let busy = false;
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
        const target = d < R ? (1 - d / R) ** 2 : 0;
        val[i] += (target - val[i]) * 0.14;
        if (Math.abs(target - val[i]) > 0.002) busy = true;
        c.style.setProperty("--p", val[i].toFixed(3));
      });
      raf = busy ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      kick();
    };
    const onLeave = () => {
      mx = -1e4;
      my = -1e4;
      kick();
    };
    const hero = el.closest("section");
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  let n = 0;
  const line = (text, accent, x) => (
    <motion.span className={`${s.nameLine} ${accent ? s.nameAccent : ""}`} style={{ x }}>
      {Array.from(text).map((c, i) => (
        <span key={i} className={s.nameMask}>
          <motion.span
            data-c=""
            className={s.nameChar}
            custom={n++}
            variants={nameChar}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
          >
            {c}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );

  return (
    <h1 ref={ref} className={s.name} aria-label={profile.name}>
      <span aria-hidden="true">
        {line(profile.firstName, false, x1)}
        {line(profile.lastName, true, x2)}
      </span>
    </h1>
  );
}

function Terminal({ ready }) {
  const [start, setStart] = useState(false);
  useEffect(() => {
    if (!ready) return undefined;
    const t = setTimeout(() => setStart(true), 1000);
    return () => clearTimeout(t);
  }, [ready]);
  const typed = useTypewriter(COMMAND, { start });
  const done = typed.length === COMMAND.length;
  const step = 0.3;

  return (
    <div className={s.terminal}>
      <div className={s.terminalBar}>
        <span className={s.dot} />
        <span className={s.dot} />
        <span className={s.dot} />
        <span>madhan.spec.js</span>
      </div>
      <div className={s.terminalBody}>
        <div className={s.cmd}>
          <b>$</b> {typed}
          {!done && <span className={s.caret} />}
        </div>
        {done &&
          checks.map(([label, time], i) => (
            <motion.div
              key={label}
              className={s.pass}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * step, duration: 0.35 }}
            >
              <motion.i
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * step, type: "spring", stiffness: 500, damping: 14 }}
              >
                ✓
              </motion.i>
              {label}
              <em>{time}</em>
            </motion.div>
          ))}
        {done && (
          <motion.div
            className={s.summaryLine}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + checks.length * step }}
          >
            {checks.length} passed · 0 flaky · ready to ship <span className={s.caret} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Hero({ ready }) {
  const tilt = useTilt(7);
  const spot = useSpotlight();
  const state = ready ? "show" : "hidden";
  const anim = (delay) => ({ variants: fade, initial: "hidden", animate: state, custom: delay });
  // Background loops (floor, halo) pause once the hero is off screen.
  const heroRef = useRef(null);
  const onScreen = useInView(heroRef);
  // Scroll-out: the name splits apart, the terminal tips back, the whole hero recedes.
  const { scrollYProgress: out } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const x1 = useTransform(out, [0, 1], ["0%", "-38%"]);
  const x2 = useTransform(out, [0, 1], ["0%", "48%"]);
  const fadeOut = useTransform(out, [0, 0.55], [1, 0]);
  const termY = useTransform(out, [0, 1], [0, -160]);
  const termRot = useTransform(out, [0, 1], [0, 22]);
  const termScale = useTransform(out, [0, 1], [1, 0.86]);

  return (
    <section id="top" ref={heroRef} className={s.hero} data-paused={!onScreen || undefined}>
      <div className={s.grid} aria-hidden="true" />
      <div className={s.glow} aria-hidden="true" />

      <div className={s.container}>
        <div className={s.inner}>
          <div className={s.left}>
            <motion.div {...anim(0)} className={s.status}>
              <span className={s.pulse} />
              {profile.role} at
              <img src={current.logo} alt={current.company} />
            </motion.div>

            <HeroName ready={ready} x1={x1} x2={x2} />

            <motion.div style={{ opacity: fadeOut }}>
            <motion.p {...anim(0.45)} className={s.role}>
              I make releases <RotatingWords words={rotating} />
            </motion.p>
            <motion.p {...anim(0.55)} className={s.text}>
              {profile.intro}
            </motion.p>
            <motion.div {...anim(0.65)} className={s.ctas}>
              <Magnetic>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className={`${ui.btn} ${ui.btnAccent}`}
                >
                  <span className={ui.btnLabel}>View résumé</span>
                  <ArrowIcon className={ui.btnIcon} />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" className={`${ui.btn} ${ui.btnGhost}`}>
                  <span className={ui.btnLabel}>Get in touch</span>
                </a>
              </Magnetic>
            </motion.div>
            </motion.div>
          </div>

          <motion.div
            className={s.terminalDepth}
            style={{ y: termY, rotateX: termRot, scale: termScale, opacity: fadeOut, transformPerspective: 1200 }}
          >
          <motion.div {...anim(0.5)} className={s.terminalWrap} aria-hidden="true">
            <motion.div className={`${ui.fx} ${s.terminalTilt}`} style={tilt.style} {...tilt.handlers}>
              <Terminal ready={ready} />
            </motion.div>
            <span className={`${s.floatChip} ${s.chipA}`}>🎭 Playwright</span>
            <span className={`${s.floatChip} ${s.chipB}`}>⚡ 40% faster cycles</span>
            <span className={`${s.floatChip} ${s.chipC}`}>✓ 95% coverage</span>
          </motion.div>
          </motion.div>
        </div>

        <motion.div {...anim(0.8)} className={s.stats}>
          {stats.map((st) => (
            <div key={st.label} className={s.stat} onPointerMove={spot}>
              <div className={s.statValue}>
                <CountUp value={`${st.value}${st.suffix}`} start={ready} />
              </div>
              <div className={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.a {...anim(1)} href="#about" className={s.scrollCue}>
          Scroll
          <span />
        </motion.a>
      </div>
    </section>
  );
}
