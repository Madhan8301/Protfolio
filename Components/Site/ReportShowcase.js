import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { report } from "@/data/portfolio";
import s from "@/styles/site/Report.module.css";
import { CountUp, TiltCard, ease, useTypewriter } from "./primitives";

/*
  An interactive replica of the custom Xray execution report I built at Rappit.
  The numbers are a sample run — the real report is internal — but every interaction mirrors it:
  status cards filter the table, Export opens PNG / PDF, the theme toggles and failed specs get an AI hint.
*/
const RUNS = [
  { file: "login.spec.ts", total: 36, passed: 36, failed: 0, skipped: 0, time: "1m 12s" },
  { file: "datamodel.api.spec.ts", total: 64, passed: 64, failed: 0, skipped: 0, time: "0m 48s" },
  { file: "workflow-builder.spec.ts", total: 58, passed: 51, failed: 6, skipped: 1, time: "4m 05s" },
  { file: "page-designer.spec.ts", total: 47, passed: 45, failed: 1, skipped: 1, time: "3m 21s" },
  { file: "permissions.spec.ts", total: 35, passed: 32, failed: 2, skipped: 1, time: "2m 09s" },
];
const sum = (k) => RUNS.reduce((n, r) => n + r[k], 0);
const TOTALS = { total: sum("total"), passed: sum("passed"), failed: sum("failed"), skipped: sum("skipped") };
const pct = (n, d) => (n / d) * 100;

const CARDS = [
  { key: "all", label: "Test cases", value: TOTALS.total, note: "Total executed" },
  { key: "passed", label: "Passed", value: TOTALS.passed, note: `${pct(TOTALS.passed, TOTALS.total).toFixed(1)}% success` },
  { key: "failed", label: "Failed", value: TOTALS.failed, note: `${pct(TOTALS.failed, TOTALS.total).toFixed(1)}% failure` },
  { key: "skipped", label: "Skipped", value: TOTALS.skipped, note: `${pct(TOTALS.skipped, TOTALS.total).toFixed(1)}% not run` },
];

const FILTERS = {
  all: () => true,
  passed: (r) => r.failed === 0,
  failed: (r) => r.failed > 0,
  skipped: (r) => r.skipped > 0,
};

const HINTS = {
  "workflow-builder.spec.ts":
    "Step 4 timed out waiting for the “Published” toast — the publish request took 34s. Wait for the response first: await page.waitForResponse('**/api/publish'), then assert the toast.",
  "page-designer.spec.ts":
    "Expected the Header widget at position 0, found Banner — the template now adds a banner on top. Find the widget by its label instead of its index, then check the order.",
  "permissions.spec.ts":
    "403 from /api/roles — the test user lost the Admin role after the nightly data reset. Re-seed the role in beforeAll, or run this spec with the admin storage state.",
};

function Donut() {
  const p = pct(TOTALS.passed, TOTALS.total);
  const f = pct(TOTALS.failed, TOTALS.total);
  const k = pct(TOTALS.skipped, TOTALS.total);
  const seg = (len, offset, cls, delay) => (
    <motion.circle
      cx="21"
      cy="21"
      r="15.5"
      pathLength="100"
      className={cls}
      strokeDashoffset={-offset}
      initial={{ strokeDasharray: "0 100" }}
      whileInView={{ strokeDasharray: `${len} 100` }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.4, delay, ease }}
    />
  );
  return (
    <div className={s.donut}>
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <circle cx="21" cy="21" r="15.5" className={s.donutTrack} />
        {seg(p, 0, s.segPass, 0.2)}
        {seg(f, p, s.segFail, 1.2)}
        {seg(k, p + f, s.segSkip, 1.4)}
      </svg>
      <span className={s.donutNum}>
        <b>{p.toFixed(1)}%</b>
        <small>pass rate</small>
      </span>
    </div>
  );
}

function AiHint({ file, onClose }) {
  const full = HINTS[file];
  const text = useTypewriter(full, { speed: 14 });
  return (
    <motion.div
      className={s.hint}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease }}
    >
      <div className={s.hintInner}>
        <span className={s.hintHead}>
          <span className={s.spark}>✦</span> AI suggestion · {file}
          <button type="button" className={s.hintClose} onClick={onClose} aria-label="Close suggestion">
            ×
          </button>
        </span>
        <p>
          {text}
          {text.length < full.length && <span className={s.caret} />}
        </p>
      </div>
    </motion.div>
  );
}

function ReportMock() {
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [exported, setExported] = useState("");
  const [hint, setHint] = useState(null);
  const menuRef = useRef(null);
  const rows = RUNS.filter(FILTERS[filter]);

  useEffect(() => {
    if (!menu) return undefined;
    const close = (e) => !menuRef.current?.contains(e.target) && setMenu(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [menu]);

  useEffect(() => {
    if (!exported) return undefined;
    const t = setTimeout(() => setExported(""), 1800);
    return () => clearTimeout(t);
  }, [exported]);

  const doExport = (kind) => {
    setMenu(false);
    setExported(kind);
  };

  return (
    <TiltCard className={s.mock} max={2} delay={0.1} data-theme={dark ? "dark" : "light"}>
      <div className={s.chrome}>
        <span />
        <span />
        <span />
        <em>execution-report.html</em>
        <i className={s.sample}>sample run</i>
      </div>

      <header className={s.rHead}>
        <span className={s.rLogo} aria-hidden="true">
          »
        </span>
        <span className={s.rTitle}>
          <b>automation report</b>
          <small>Test. Automate. Accelerate.</small>
        </span>
        <div className={s.rActions}>
          <div className={s.exportWrap} ref={menuRef}>
            <button type="button" className={s.exportBtn} aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
              {exported ? `✓ ${exported} saved` : "Export ▾"}
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div
                  className={s.menu}
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.2, ease }}
                >
                  <button type="button" onClick={() => doExport("PNG")}>
                    <b>PNG</b>
                    <span>Dashboard snapshot</span>
                  </button>
                  <button type="button" onClick={() => doExport("PDF")}>
                    <b>PDF</b>
                    <span>Every failure, every test case</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            className={s.themeBtn}
            role="switch"
            aria-checked={dark}
            aria-label="Dark theme"
            onClick={() => setDark((d) => !d)}
          >
            <span>{dark ? "☾" : "☀"}</span>
          </button>
        </div>
      </header>

      <div className={s.rBody}>
        <div className={s.cards}>
          {CARDS.map((c) => (
            <button
              key={c.key}
              type="button"
              className={s.kpi}
              data-kind={c.key}
              aria-pressed={filter === c.key}
              onClick={() => setFilter(c.key)}
            >
              <span className={s.kpiLabel}>{c.label}</span>
              <b className={s.kpiValue}>
                <CountUp value={String(c.value)} />
              </b>
              <small>{c.note}</small>
            </button>
          ))}
        </div>

        <div className={s.lower}>
          <div className={s.passCard}>
            <span className={s.cardTitle}>Pass rate</span>
            <Donut />
            <ul className={s.legend}>
              <li data-kind="passed">Passed</li>
              <li data-kind="failed">Failed</li>
              <li data-kind="skipped">Skipped</li>
            </ul>
          </div>

          <div className={s.tableCard}>
            <span className={s.cardTitle}>
              Test executions <i>({rows.length})</i>
              {filter !== "all" && (
                <button type="button" className={s.clear} onClick={() => setFilter("all")}>
                  Clear filter
                </button>
              )}
            </span>
            <ul className={s.table}>
              <AnimatePresence initial={false}>
                {rows.map((r) => {
                  const failed = r.failed > 0;
                  const rate = pct(r.passed, r.total);
                  return (
                    <motion.li
                      key={r.file}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3, ease }}
                      className={s.row}
                    >
                      <span className={s.file}>
                        <b>{r.file}</b>
                        <small>
                          {r.total} tests · {r.time}
                        </small>
                      </span>
                      <span className={s.rate}>
                        <i style={{ "--w": `${rate}%` }} data-failed={failed} />
                        {rate.toFixed(0)}%
                      </span>
                      {failed ? (
                        <button
                          type="button"
                          className={s.aiBtn}
                          aria-expanded={hint === r.file}
                          onClick={() => setHint((h) => (h === r.file ? null : r.file))}
                          title="Ask AI why it failed"
                        >
                          ✦ AI
                        </button>
                      ) : (
                        <span />
                      )}
                      <span className={s.status} data-failed={failed}>
                        {failed ? "Failed" : "Passed"}
                      </span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            <AnimatePresence mode="wait">
              {hint && rows.some((r) => r.file === hint) && <AiHint key={hint} file={hint} onClose={() => setHint(null)} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export default function ReportShowcase() {
  return (
    <div className={s.wrap}>
      <motion.div
        className={s.divider}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, ease }}
      >
        <span className={s.dividerTag}>+ reporting</span>
        <span className={s.dividerRule} />
        <span>where every run ends up</span>
      </motion.div>

      <div className={s.grid}>
        <motion.div
          className={s.info}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
        >
          <p className={s.kicker}>
            <span className={s.dot} />
            {report.org} · {report.period} · Built from scratch
          </p>
          <h3 className={s.name}>{report.name}</h3>
          <p className={s.summary}>{report.summary}</p>
          <ul className={s.features}>
            {report.features.map((f, i) => (
              <motion.li
                key={f.title}
                data-card=""
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease }}
              >
                <b>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {f.title}
                </b>
                <small>{f.text}</small>
              </motion.li>
            ))}
          </ul>
          <div className={s.stack}>
            {report.stack.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <p className={s.tryIt}>
            <span className={s.tryArrow} aria-hidden="true">→</span> Try it — tap a status card, open Export, flip the theme or ask the AI.
          </p>
        </motion.div>

        <ReportMock />
      </div>
    </div>
  );
}
