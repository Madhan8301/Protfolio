import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { experience, profile, stats } from "@/data/portfolio";
import s from "@/styles/site/Hero.module.css";
import ui from "@/styles/site/ui.module.css";
import { ArrowIcon, CountUp, Magnetic, RevealText, RotatingWords, ease, useSpotlight, useTilt, useTypewriter } from "./primitives";

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

            <RevealText
              as="h1"
              parts={[profile.firstName, { text: profile.lastName, em: true }]}
              className={s.name}
              play={ready}
              delay={0.1}
              stagger={0.12}
              aria-label={profile.name}
            />

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
          </div>

          <motion.div {...anim(0.5)} className={s.terminalWrap} aria-hidden="true">
            <motion.div className={`${ui.fx} ${s.terminalTilt}`} style={tilt.style} {...tilt.handlers}>
              <Terminal ready={ready} />
            </motion.div>
            <span className={`${s.floatChip} ${s.chipA}`}>🎭 Playwright</span>
            <span className={`${s.floatChip} ${s.chipB}`}>⚡ 40% faster cycles</span>
            <span className={`${s.floatChip} ${s.chipC}`}>✓ 95% coverage</span>
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
