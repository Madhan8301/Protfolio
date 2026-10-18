import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import s from "@/styles/site/Capabilities.module.css";
import { Odometer, ease } from "./primitives";

/* Steps an index while the element is on screen; `length + hold` gives a pause at the end. */
function useLoop(ref, length, { interval = 650, hold = 3, start = -1 } = {}) {
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  // Always start from the server-rendered state; reduced motion jumps to the end in the effect.
  const [step, setStep] = useState(start);
  useEffect(() => {
    if (reduce) {
      setStep(length);
      return undefined;
    }
    if (!inView) return undefined;
    const t = setInterval(() => setStep((v) => (v >= length + hold ? start : v + 1)), interval);
    return () => clearInterval(t);
  }, [inView, reduce, length, hold, interval, start]);
  return step;
}

/* ---------- Keyword sheet: rows execute one by one ---------- */
const sheet = [
  ["OpenURL", "—", "app.rappit.io", "0.6s"],
  ["Click", "btn: New App", "—", "0.2s"],
  ["Fill", "input: App name", "Demo CRM", "0.3s"],
  ["DragDrop", "widget: Table", "canvas", "0.5s"],
  ["Verify", "toast", "“Saved”", "0.1s"],
  ["Screenshot", "page", "report.html", "0.4s"],
];

export function SheetViz() {
  const ref = useRef(null);
  const step = useLoop(ref, sheet.length, { interval: 700, hold: 4 });
  const done = step >= sheet.length;
  return (
    <div ref={ref} className={s.sheet} aria-hidden="true">
      <div className={s.sheetBar}>
        <span className={s.sheetFile}>
          <i className={s.xls}>X</i> keywords.xlsx
        </span>
        <span className={`${s.sheetState} ${done ? s.ok : ""}`}>
          {done ? "✓ 6 passed · 2.1s" : step >= 0 ? `Running ${step + 1}/${sheet.length}` : "Queued"}
        </span>
      </div>
      <div className={`${s.sheetRow} ${s.sheetHead}`}>
        <span>#</span>
        <span>Keyword</span>
        <span>Locator</span>
        <span>Data</span>
        <span>Status</span>
      </div>
      {sheet.map((r, i) => {
        const state = i < step ? "done" : i === step ? "run" : "idle";
        return (
          <div key={r[0]} className={s.sheetRow} data-state={state}>
            <span>{i + 1}</span>
            <span className={s.kw}>{r[0]}</span>
            <span>{r[1]}</span>
            <span>{r[2]}</span>
            <span className={s.status}>
              {state === "done" && <b>✓ {r[3]}</b>}
              {state === "run" && <i className={s.spinner} />}
              {state === "idle" && "—"}
            </span>
            {state === "run" && <span className={s.rowProgress} />}
          </div>
        );
      })}
      <div className={s.sheetFoot}>
        <span>
          <b>$</b> npx playwright-mcp run keywords.xlsx
        </span>
        <span>0 code changes</span>
      </div>
    </div>
  );
}

/* ---------- Gherkin: steps light up and pass ---------- */
const gherkin = [
  { kw: "Feature:", text: "Policy issuance" },
  { kw: "Scenario:", text: "Agent issues a new policy", indent: 1 },
  { kw: "Given", text: "the agent is logged in", indent: 2, step: 0 },
  { kw: "When", text: "they submit a valid proposal", indent: 2, step: 1 },
  { kw: "Then", text: "a policy number is generated", indent: 2, step: 2 },
  { kw: "And", text: "the premium matches the rate card", indent: 2, step: 3 },
];

export function GherkinViz() {
  const ref = useRef(null);
  const step = useLoop(ref, 4, { interval: 800, hold: 3 });
  return (
    <div ref={ref} className={s.code} aria-hidden="true">
      <div className={s.codeBar}>
        <span>policy_issuance.feature</span>
        <span className={step >= 4 ? s.ok : ""}>{step >= 4 ? "✓ 4 steps passed" : "Cucumber · running"}</span>
      </div>
      <div className={s.codeBody}>
        {gherkin.map((line, i) => {
          const state = line.step === undefined ? "" : line.step < step ? "done" : line.step === step ? "run" : "idle";
          return (
            <div key={i} className={s.codeLine} data-state={state}>
              <span className={s.ln}>{i + 1}</span>
              <span style={{ paddingLeft: `${(line.indent || 0) * 1.1}em` }}>
                <span className={s.ck}>{line.kw}</span> {line.text}
              </span>
              <span className={s.codeStatus}>{state === "done" ? "✓" : state === "run" ? "●" : ""}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Coverage ring ---------- */
export function CoverageViz() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const R = 54;
  const C = 2 * Math.PI * R;
  return (
    <div ref={ref} className={s.coverage}>
      <svg viewBox="0 0 140 140" className={s.ring} aria-hidden="true">
        <circle cx="70" cy="70" r={R + 10} className={s.ringTicks} />
        <circle cx="70" cy="70" r={R} className={s.ringTrack} />
        <motion.circle
          cx="70"
          cy="70"
          r={R}
          className={s.ringValue}
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: inView ? C * 0.05 : C }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className={s.ringCenter}>
        <Odometer value={95} suffix="%" className={s.ringNumber} />
        <span>coverage</span>
      </div>
    </div>
  );
}

/* ---------- Mobile: taps verified on a phone ---------- */
const taps = [
  { x: "50%", y: "34%" },
  { x: "50%", y: "56%" },
  { x: "50%", y: "82%" },
];

export function MobileViz() {
  const ref = useRef(null);
  const step = useLoop(ref, taps.length, { interval: 900, hold: 1, start: 0 });
  const active = step < taps.length ? step : -1;
  return (
    <div ref={ref} className={s.phoneWrap} aria-hidden="true">
      <div className={s.phone}>
        <span className={s.notch} />
        <span className={s.scrBar} />
        <span className={s.scrCard} data-on={active === 0} />
        <span className={s.scrCard} data-on={active === 1} />
        <span className={s.scrBtn} data-on={active === 2} />
        {active >= 0 && (
          <motion.span
            key={step}
            className={s.tap}
            style={{ left: taps[active].x, top: taps[active].y }}
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          />
        )}
      </div>
      <motion.span
        className={s.toast}
        animate={{ opacity: step >= taps.length ? 1 : 0, y: step >= taps.length ? 0 : 8 }}
        transition={{ duration: 0.35 }}
      >
        ✓ Flow verified on device
      </motion.span>
    </div>
  );
}

/* ---------- CI/CD pipeline ---------- */
const stages = ["Checkout", "Build", "Test ×4", "Report", "Deploy"];

export function PipelineViz() {
  const ref = useRef(null);
  const step = useLoop(ref, stages.length, { interval: 850, hold: 3 });
  const done = step >= stages.length;
  const progress = Math.max(0, Math.min(step, stages.length - 1)) / (stages.length - 1);
  return (
    <div ref={ref} className={s.pipe} aria-hidden="true">
      <div className={s.pipeTop}>
        <span>
          Build <b>#1284</b> · main
        </span>
        <span className={`${s.pipeState} ${done ? s.ok : ""}`}>{done ? "✓ Passed · 6m 12s" : step >= 0 ? "Running" : "Queued"}</span>
      </div>
      <div className={s.pipeTrack}>
        <span className={s.pipeLine} />
        <motion.span
          className={s.pipeFill}
          animate={{ scaleX: step < 0 ? 0 : done ? 1 : progress }}
          transition={{ duration: 0.7, ease }}
        />
        {stages.map((label, i) => {
          const state = done || i < step ? "done" : i === step ? "run" : "idle";
          return (
            <div key={label} className={s.stage} data-state={state}>
              <span className={s.node}>{state === "done" ? "✓" : state === "run" ? <i className={s.spinner} /> : i + 1}</span>
              <span className={s.stageLabel}>{label}</span>
              {i === 2 && (
                <span className={s.shards} data-active={state !== "idle"}>
                  {[0, 1, 2, 3].map((k) => (
                    <span key={k} style={{ "--d": `${0.5 + k * 0.17}s` }} />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Word list with a cycling highlight ---------- */
export function CycleList({ items }) {
  const ref = useRef(null);
  const step = useLoop(ref, items.length - 1, { interval: 1300, hold: 0, start: 0 });
  return (
    <ul ref={ref} className={s.cycle}>
      {items.map((it, i) => (
        <li key={it} data-on={i === step % items.length}>
          {it}
        </li>
      ))}
    </ul>
  );
}
