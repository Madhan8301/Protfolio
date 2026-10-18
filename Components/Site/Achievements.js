import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { award, impact, milestones } from "@/data/portfolio";
import s from "@/styles/site/Achievements.module.css";
import { CountUp, SectionHeader, TiltCard, ease } from "./primitives";

/* ---------- Champion Award: medal with a confetti burst ---------- */
const CONFETTI = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const dist = 90 + (i % 3) * 26;
  return {
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    r: (i * 47) % 360,
    c: ["#3ddc97", "#6ec3ff", "#ffd166", "#c9ffe6"][i % 4],
    round: i % 3 === 0,
  };
});

function Medal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    if (inView && !reduce) setBurst(1);
  }, [inView, reduce]);

  return (
    <div ref={ref} className={s.medalWrap} onPointerEnter={() => !reduce && setBurst((b) => b + 1)} aria-hidden="true">
      <span className={s.rays} />
      {burst > 0 &&
        CONFETTI.map((p, i) => (
          <motion.span
            key={`${burst}-${i}`}
            className={s.confetti}
            style={{ background: p.c, borderRadius: p.round ? "50%" : 2 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
            animate={{ x: p.x, y: p.y + 30, opacity: 0, scale: 1, rotate: p.r }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      <motion.div
        className={s.medal}
        initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.15 }}
      >
        <span className={s.medalFoil} />
        <span className={s.medalCore}>
          <svg viewBox="0 0 24 24">
            <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" fill="currentColor" />
          </svg>
        </span>
      </motion.div>
      <span className={s.ribbonL} />
      <span className={s.ribbonR} />
    </div>
  );
}

function AwardCard() {
  return (
    <TiltCard as="article" className={`${s.tile} ${s.award}`} max={4}>
      <div className={s.awardTop}>
        <Medal />
        <span className={s.badge}>🏆 {award.year}</span>
      </div>
      <div>
        <p className={s.kicker}>{award.org}</p>
        <h3 className={s.awardTitle}>{award.title}</h3>
        <p className={s.awardText}>{award.detail}</p>
        <div className={s.awardStats}>
          <div>
            <b>
              <CountUp value="30%" />
            </b>
            <span>faster execution</span>
          </div>
          <div>
            <b>
              <CountUp value="40%" />
            </b>
            <span>less manual effort</span>
          </div>
          <div>
            <b>1</b>
            <span>new framework</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

/* ---------- Before / after automation ---------- */
function Comparison() {
  return (
    <TiltCard as="article" className={`${s.tile} ${s.compare}`} max={3} delay={0.08}>
      <header className={s.tileHead}>
        <span className={s.tileLabel}>Before → after automation</span>
        <span className={s.legend}>
          <i className={s.legendManual} /> Manual <i className={s.legendAuto} /> Automated
        </span>
      </header>
      <ul className={s.bars}>
        {impact.comparisons.map((c, i) => (
          <li key={c.label} className={s.barRow}>
            <div className={s.barText}>
              <b>{c.label}</b>
              <small>{c.where}</small>
            </div>
            <div className={s.barTrack}>
              <span className={s.barManual} />
              <motion.span
                className={s.barAuto}
                initial={{ width: "100%" }}
                whileInView={{ width: `${c.after}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.6, delay: 0.3 + i * 0.18, ease }}
              />
            </div>
            <span className={s.delta}>
              <CountUp value={`${100 - c.after}%`} />
              <small>less</small>
            </span>
          </li>
        ))}
      </ul>
    </TiltCard>
  );
}

/* ---------- 6,000+ test cases: a grid of dots that "pass" one by one (each dot = 50 tests) ---------- */
function TestCases() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const { value: total, perDot, where } = impact.testcases;
  const dots = Math.round(total / perDot);
  const [passed, setPassed] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setPassed(dots);
      return undefined;
    }
    const t = setInterval(() => setPassed((p) => (p >= dots ? dots : p + 2)), 16);
    return () => clearInterval(t);
  }, [inView, reduce, dots]);

  return (
    <TiltCard as="article" className={`${s.tile} ${s.scenarios}`} max={6} delay={0.04}>
      <header className={s.tileHead}>
        <span className={s.tileLabel}>Automated test cases</span>
        <span className={s.passPill}>{(Math.min(passed, dots) * perDot).toLocaleString("en-US")} passed</span>
      </header>
      <div ref={ref} className={s.dots} aria-hidden="true">
        {Array.from({ length: dots }, (_, i) => (
          <span key={i} data-on={i < passed} />
        ))}
      </div>
      <div className={s.bigRow}>
        <span className={s.big}>
          <CountUp value={`${total}+`} />
        </span>
        <span className={s.where}>
          for a single feature — {where.split(" · ")[0]}
          <small className={s.dotKey}>1 dot = {perDot} tests</small>
        </span>
      </div>
    </TiltCard>
  );
}

/* ---------- 95% coverage gauge ---------- */
function Coverage() {
  const R = 52;
  const C = Math.PI * R; // half circle
  const v = impact.coverage.value / 100;
  return (
    <TiltCard as="article" className={`${s.tile} ${s.coverage}`} max={6} delay={0.08}>
      <header className={s.tileHead}>
        <span className={s.tileLabel}>Test coverage</span>
      </header>
      <div className={s.gauge}>
        <svg viewBox="0 0 128 76" aria-hidden="true">
          <path d="M12 66a52 52 0 0 1 104 0" className={s.gaugeTrack} />
          <motion.path
            d="M12 66a52 52 0 0 1 104 0"
            className={s.gaugeValue}
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            whileInView={{ strokeDashoffset: C * (1 - v) }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className={s.gaugeNum}>
          <CountUp value={`${impact.coverage.value}%`} />
        </span>
      </div>
      <p className={s.where}>{impact.coverage.where}</p>
    </TiltCard>
  );
}

/* ---------- +30% execution success ---------- */
function Success() {
  return (
    <TiltCard as="article" className={`${s.tile} ${s.success}`} max={6} delay={0.04}>
      <header className={s.tileHead}>
        <span className={s.tileLabel}>Execution success rate</span>
      </header>
      <div className={s.rise} aria-hidden="true">
        <div className={s.riseCol}>
          <span className={s.riseBar} style={{ height: "56%" }} />
          <small>Before</small>
        </div>
        <div className={s.riseCol}>
          <motion.span
            className={`${s.riseBar} ${s.riseAfter}`}
            initial={{ height: "56%" }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, delay: 0.3, ease }}
          >
            <i>↑</i>
          </motion.span>
          <small>After</small>
        </div>
      </div>
      <div className={s.bigRow}>
        <span className={s.big}>
          +<CountUp value={`${impact.success.value}%`} />
        </span>
        <span className={s.where}>{impact.success.where}</span>
      </div>
    </TiltCard>
  );
}

/* ---------- Milestones timeline ---------- */
function Milestones() {
  return (
    <TiltCard as="article" className={`${s.tile} ${s.milestones}`} max={2} delay={0.08}>
      <header className={s.tileHead}>
        <span className={s.tileLabel}>Milestones</span>
      </header>
      <ol className={s.timeline} style={{ "--n": milestones.length }}>
        <motion.span
          className={s.timelineLine}
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.6, ease }}
        />
        {milestones.map((m, i) => (
          <motion.li
            key={m.title}
            className={s.mItem}
            data-current={m.current || undefined}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 + i * 0.22, ease }}
          >
            <span className={s.mNode} />
            <span className={s.mYear}>{m.year}</span>
            <b className={s.mTitle}>{m.title}</b>
            <span className={s.mText}>{m.text}</span>
          </motion.li>
        ))}
      </ol>
    </TiltCard>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className={s.section}>
      <SectionHeader
        index="06"
        label="Achievements"
        title={["Results that", { text: "shipped.", em: true }]}
        intro="Real numbers from real projects — each one measured against the manual process it replaced."
      />
      <div className={s.grid}>
        <AwardCard />
        <TestCases />
        <Coverage />
        <Comparison />
        <Success />
        <Milestones />
      </div>
    </section>
  );
}
