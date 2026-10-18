import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { frameworks } from "@/data/portfolio";
import s from "@/styles/site/Frameworks.module.css";
import { CountUp, SectionHeader, TiltCard, ease } from "./primitives";
import ReportShowcase from "./ReportShowcase";

/* Architecture diagram: stages light up left to right while a pulse travels the connector. */
function Flow({ steps }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(reduce ? steps.length - 1 : 0);

  useEffect(() => {
    if (reduce || !inView) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % (steps.length + 1)), 900);
    return () => clearInterval(t);
  }, [inView, reduce, steps.length]);

  return (
    <div ref={ref} className={s.flow} style={{ "--steps": steps.length }}>
      <div className={s.track} aria-hidden="true">
        <span className={s.trackFill} style={{ "--p": Math.min(active, steps.length - 1) / (steps.length - 1) }} />
        {!reduce && <span className={s.pulse} />}
      </div>
      <ol className={s.steps}>
        {steps.map((st, i) => (
          <motion.li
            key={st.title}
            className={s.step}
            data-on={i <= active && active < steps.length}
            data-card=""
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease }}
            whileHover={{ y: -6 }}
          >
            <span className={s.node}>{String(i + 1).padStart(2, "0")}</span>
            <span className={s.stepTitle}>{st.title}</span>
            <span className={s.stepNote}>{st.note}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function Frameworks() {
  const [index, setIndex] = useState(0);
  const fw = frameworks[index];
  const tabRefs = useRef([]);

  const onKeyDown = (e) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + frameworks.length) % frameworks.length;
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="frameworks" className={s.section}>
      <SectionHeader
        index="03"
        label="Frameworks"
        title={["Frameworks I've", { text: "engineered.", em: true }]}
        intro="I don't just write tests — I design the systems that run them. Pick a framework to see how it's built and what it changed."
      />

      <div className={s.tabs} role="tablist" aria-label="Frameworks" onKeyDown={onKeyDown}>
        {frameworks.map((f, i) => (
          <button
            key={f.id}
            ref={(el) => (tabRefs.current[i] = el)}
            type="button"
            role="tab"
            id={`fw-tab-${f.id}`}
            aria-selected={i === index}
            aria-controls="fw-panel"
            tabIndex={i === index ? 0 : -1}
            className={s.tab}
            onClick={() => setIndex(i)}
          >
            {i === index && <motion.span layoutId="fwTab" className={s.tabBg} transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className={s.tabNum}>{String(i + 1).padStart(2, "0")}</span>
            <span className={s.tabText}>
              <b>{f.short}</b>
              <small>
                {f.type} · {f.org.split(" ")[0]}
              </small>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={fw.id}
          id="fw-panel"
          role="tabpanel"
          aria-labelledby={`fw-tab-${fw.id}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease }}
        >
          <TiltCard className={s.panel} max={2.5}>
            <div className={s.panelGrid}>
              <div className={s.info}>
                <p className={s.kicker}>
                  <span className={s.dot} />
                  {fw.org} · {fw.period}
                </p>
                <h3 className={s.name}>{fw.name}</h3>
                <p className={s.summary}>{fw.summary}</p>
                <ul className={s.features}>
                  {fw.features.map((f, i) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.15 + i * 0.06, ease }}
                    >
                      <span className={s.check} aria-hidden="true">
                        ✓
                      </span>
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className={s.metrics}>
                {fw.metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    className={s.metric}
                    data-card=""
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease }}
                  >
                    <span className={s.metricValue}>
                      <CountUp value={`${m.value}${m.suffix}`} />
                    </span>
                    <span className={s.metricLabel}>{m.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={s.archHead}>
              <span>Architecture</span>
              <span className={s.archRule} />
              <div className={s.stack}>
                {fw.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <Flow steps={fw.flow} />
          </TiltCard>
        </motion.div>
      </AnimatePresence>

      <ReportShowcase />
    </section>
  );
}
