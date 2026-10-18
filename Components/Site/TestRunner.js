import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import s from "@/styles/site/TestRunner.module.css";
import { ease } from "./primitives";
import { scrollToHash } from "./SmoothScroll";

/*
  Scrolling the page "runs" the portfolio as a test suite: each section is a spec.
  Desktop: a slim progress rail in the empty left margin (hover for the spec list, click to jump).
  Everywhere: a short toast as each spec passes, so nothing permanently covers the content.
*/
export const SPECS = [
  { id: "top", file: "hero", title: "shows Madhan's name" },
  { id: "about", file: "about", title: "loads the profile" },
  { id: "experience", file: "experience", title: "lists 3 companies" },
  { id: "frameworks", file: "frameworks", title: "4 frameworks built" },
  { id: "capabilities", file: "skills", title: "every tool runs live" },
  { id: "work", file: "work", title: "projects open" },
  { id: "achievements", file: "achievements", title: "results verified" },
  { id: "recognition", file: "credentials", title: "certified & published" },
  { id: "contact", file: "contact", title: "Madhan is reachable" },
];

const fmt = (sec) => (sec < 60 ? `${sec.toFixed(1)}s` : `${Math.floor(sec / 60)}m ${Math.round(sec % 60)}s`);

export default function TestRunner({ ready }) {
  const [current, setCurrent] = useState(0);
  const [passedAt, setPassedAt] = useState(() => SPECS.map(() => null));
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const start = useRef(0);
  const shown = useRef(0);

  const passedCount = passedAt.filter((t) => t !== null).length;
  const allPassed = passedCount === SPECS.length;
  const total = allPassed ? Math.max(...passedAt) : null;

  useEffect(() => {
    if (!ready) return undefined;
    start.current = performance.now();
    let tops = [];
    const measure = () => {
      tops = SPECS.map((sp) => {
        const el = document.getElementById(sp.id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
      });
    };
    const update = () => {
      const line = window.scrollY + window.innerHeight * 0.55;
      let c = 0;
      while (c < tops.length - 1 && tops[c + 1] <= line) c++;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      const t = (performance.now() - start.current) / 1000;
      setCurrent(c);
      setPassedAt((prev) => {
        let changed = false;
        const next = prev.map((v, i) => {
          if (v === null && (i < c || atBottom)) {
            changed = true;
            return t;
          }
          return v;
        });
        return changed ? next : prev;
      });
    };
    measure();
    update();
    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, [ready]);

  // Toast whenever new specs pass.
  useEffect(() => {
    const gained = passedCount - shown.current;
    if (gained <= 0) return undefined;
    shown.current = passedCount;
    let text;
    if (passedCount === SPECS.length) text = `${SPECS.length} passed · all green · ${fmt(total)}`;
    else if (gained > 1) text = `${gained} specs passed`;
    else {
      const latest = passedAt.reduce((best, v, i) => (v !== null && (best < 0 || v >= passedAt[best]) ? i : best), -1);
      text = `${SPECS[latest].file}.spec.ts passed`;
    }
    setToast({ text, id: passedCount, done: passedCount === SPECS.length });
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [passedCount, passedAt, total]);

  const progress = passedCount === 0 ? 0 : (Math.min(passedCount, SPECS.length) - 1) / (SPECS.length - 1);
  // The hero has its own scroll cue (and stats band where this would sit), so no start hint.
  const hint = false;

  return (
    <>
      <motion.nav
        className={s.rail}
        aria-label="Test run progress"
        initial={{ opacity: 0, x: -20 }}
        animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.9, delay: 1.2, ease }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
      >
        <span className={s.line} aria-hidden="true">
          <span className={s.fill} style={{ transform: `scaleY(${progress})` }} />
        </span>
        {SPECS.map((sp, i) => {
          const done = passedAt[i] !== null;
          const state = done ? "done" : i === current ? "run" : "idle";
          return (
            <button
              key={sp.id}
              type="button"
              className={s.node}
              data-state={state}
              aria-label={`${sp.file}.spec.ts — ${done ? "passed" : state === "run" ? "running" : "queued"}`}
              onClick={() => scrollToHash(`#${sp.id}`)}
            />
          );
        })}

        <AnimatePresence>
          {open && (
            <motion.div
              className={s.panel}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease }}
            >
              <div className={s.panelHead}>
                <span>portfolio.spec.ts</span>
                <span className={allPassed ? s.ok : ""}>
                  {passedCount}/{SPECS.length} passed
                </span>
              </div>
              <ul className={s.list}>
                {SPECS.map((sp, i) => {
                  const done = passedAt[i] !== null;
                  const running = !done && i === current;
                  const prev = passedAt.slice(0, i).reduce((m, v) => (v !== null && v > m ? v : m), 0);
                  return (
                    <li key={sp.id} className={s.spec} data-state={done ? "done" : running ? "run" : "idle"}>
                      <span className={s.icon} aria-hidden="true">
                        {done ? "✓" : running ? <i className={s.spinner} /> : "○"}
                      </span>
                      <span className={s.specName}>
                        <b>{sp.file}</b> › {sp.title}
                      </span>
                      <span className={s.time}>{done ? fmt(Math.max(0.1, passedAt[i] - prev)) : running ? "running" : ""}</span>
                    </li>
                  );
                })}
              </ul>
              <p className={s.panelFoot}>
                <span className={s.ok}>{passedCount} passed</span> · {SPECS.length - passedCount} queued · 0 failed
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <div className={s.toastSlot} aria-live="polite">
        <AnimatePresence mode="wait">
          {hint && (
            <motion.p
              key="hint"
              className={s.toast}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 1.6, ease }}
            >
              <span className={s.play} aria-hidden="true">
                ▶
              </span>
              Scroll to run the test suite
            </motion.p>
          )}
          {!hint && toast && (
            <motion.p
              key={toast.id}
              className={`${s.toast} ${toast.done ? s.toastDone : ""}`}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.35, ease }}
            >
              <span className={s.tick} aria-hidden="true">
                ✓
              </span>
              {toast.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
