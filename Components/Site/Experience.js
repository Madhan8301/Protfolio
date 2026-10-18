import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { experience } from "@/data/portfolio";
import s from "@/styles/site/Experience.module.css";
import ui from "@/styles/site/ui.module.css";
import { ArrowIcon, CountUp, SectionHeader, ease, useTilt } from "./primitives";
import { scrollToHash } from "./SmoothScroll";

const VISIBLE = 4;
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Stack names → logo files in public/assets/logos (anything missing renders as a plain chip).
const LOGOS = {
  Playwright: "playwright",
  "Playwright MCP": "playwright",
  JavaScript: "javascript",
  TypeScript: "typescript",
  Selenium: "selenium",
  Java: "java",
  "Cucumber BDD": "cucumber",
  WebDriverIO: "webdriverio",
  Appium: "appium",
  UiPath: "uipath",
  HTML: "html5",
  CSS: "css3",
  React: "react",
  "Node.js": "nodejs",
  "Spring Boot": "spring",
};

// "Dec 2022 — May 2025" → "2022 — 2025"; same year on both ends collapses to "2022".
const years = (period) => {
  const [from, to] = period.replace(/[A-Za-z]{3}\s(?=\d)/g, "").split(" — ");
  return from === to ? from : `${from} — ${to}`;
};

const slug = (company) => `job-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

// "Dec 2022 — May 2025" → { start, end }; "Present" → end null (filled in on the client).
function parsePeriod(period) {
  const [from, to = ""] = period.split("—").map((p) => p.trim().toLowerCase());
  const toDate = (p) => {
    const m = p.match(/([a-z]{3})[a-z]*\s+(\d{4})/);
    return m ? { y: Number(m[2]), m: MONTHS.indexOf(m[1]) } : null;
  };
  return { start: toDate(from), end: toDate(to) };
}

// LinkedIn-style inclusive duration: "1 yr 6 mos", "8 mos".
function duration(start, end) {
  const months = (end.y - start.y) * 12 + (end.m - start.m) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

/* The current job's duration depends on today's date, so compute after mount (no hydration mismatch). */
function useDurations() {
  const [list, setList] = useState(() => experience.map(() => ""));
  useEffect(() => {
    const now = new Date();
    const today = { y: now.getFullYear(), m: now.getMonth() };
    setList(
      experience.map((job) => {
        const { start, end } = parsePeriod(job.period);
        return start ? duration(start, end || today) : "";
      })
    );
  }, []);
  return list;
}

function useActiveJob() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = experience.map((job) => document.getElementById(slug(job.company))).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(els.indexOf(e.target))),
      { rootMargin: "-40% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

/* ---------- Left: sticky career timeline ---------- */
function Timeline({ active, durations }) {
  const progress = experience.length > 1 ? active / (experience.length - 1) : 1;
  return (
    <aside className={s.timeline} aria-label="Career timeline">
      <p className={s.tlLabel}>Career path</p>
      <div className={s.tlBody}>
        <span className={s.tlTrack} aria-hidden="true">
          <span className={s.tlFill} style={{ "--p": progress }} />
        </span>
        <ol className={s.tlList}>
          {experience.map((job, i) => (
            <li key={job.company}>
              <button
                type="button"
                className={s.tlItem}
                data-active={i === active}
                data-done={i < active}
                onClick={() => scrollToHash(`#${slug(job.company)}`)}
              >
                <span className={s.tlLogo}>
                  <img src={job.logo} alt="" />
                </span>
                <span className={s.tlText}>
                  <b>{job.company}</b>
                  <small>{years(job.period)}</small>
                  {durations[i] && <small className={s.tlDur}>{durations[i]}</small>}
                </span>
                {job.current && <span className={s.tlNow}>Now</span>}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div className={s.tlSummary}>
        <div>
          <b>4+</b>
          <span>years</span>
        </div>
        <div>
          <b>{experience.length}</b>
          <span>companies</span>
        </div>
        <div>
          <b>6K+</b>
          <span>test cases</span>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Right: one card per job ---------- */
function JobCard({ job, index, total, durationText }) {
  const [open, setOpen] = useState(false);
  const tilt = useTilt(2.2);
  const extra = job.highlights.length - VISIBLE;
  const shown = open ? job.highlights : job.highlights.slice(0, VISIBLE);

  return (
    <motion.article
      id={slug(job.company)}
      className={`${ui.fx} ${s.card} ${job.current ? s.current : ""}`}
      style={{ ...tilt.style, "--tint": job.tint }}
      {...tilt.handlers}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease }}
    >
      <header className={s.head}>
        <span className={s.logo}>
          <img src={job.logo} alt={`${job.company} logo`} />
        </span>
        <div className={s.titles}>
          <div className={s.badges}>
            {job.current ? (
              <span className={s.now}>
                <span className={s.pulse} /> Current role
              </span>
            ) : (
              <span className={s.step}>
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            )}
            <span className={s.period}>{job.period}</span>
            {durationText && <span className={s.duration}>{durationText}</span>}
          </div>
          <h3 className={s.role}>{job.role}</h3>
          <p className={s.company}>
            {job.url ? (
              <a href={job.url} target="_blank" rel="noreferrer">
                {job.company}
                <ArrowIcon className={s.arrow} />
              </a>
            ) : (
              job.company
            )}
          </p>
        </div>
      </header>

      {job.statement ? <p className={s.statement}>“{job.statement}”</p> : job.summary && <p className={s.summary}>{job.summary}</p>}

      {job.metrics && (
        <div className={s.metrics}>
          {job.metrics.map((m, i) => (
            <div key={m.label} className={s.metric}>
              <span className={s.metricValue}>
                <CountUp value={m.value} />
              </span>
              <span className={s.metricLabel}>{m.label}</span>
              <span className={s.meter} aria-hidden="true">
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: Math.min(1, parseInt(m.value, 10) / 100) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, delay: 0.25 + i * 0.12, ease }}
                />
              </span>
            </div>
          ))}
        </div>
      )}

      <div className={s.body}>
        <p className={s.subhead}>Key contributions</p>
        <ul className={s.highlights}>
          <AnimatePresence initial={false}>
            {shown.map((h) => (
              <motion.li
                key={h}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease }}
              >
                <span className={s.hl}>
                  <span className={s.check} aria-hidden="true">
                    ✓
                  </span>
                  {h}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {extra > 0 && (
          <button type="button" className={s.more} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "Show less" : `Show ${extra} more`}
            <span className={s.moreIcon} data-open={open} aria-hidden="true">
              ↓
            </span>
          </button>
        )}
      </div>

      <footer className={s.foot}>
        <p className={s.subhead}>Tech stack</p>
        <div className={s.stack}>
          {job.stack.map((t) => (
            <span key={t} className={s.tool}>
              {LOGOS[t] && <img src={`/assets/logos/${LOGOS[t]}.svg`} alt="" />}
              {t}
            </span>
          ))}
        </div>
      </footer>
    </motion.article>
  );
}

export default function Experience() {
  const durations = useDurations();
  const active = useActiveJob();

  return (
    <section id="experience" className={s.section}>
      <SectionHeader
        index="02"
        label="Experience"
        title={["Where I've", { text: "worked.", em: true }]}
        intro="From building both sides of the stack to designing the frameworks that test them — three teams, one obsession: predictable releases."
      />
      <div className={s.layout}>
        <Timeline active={active} durations={durations} />
        <div className={s.cards}>
          {experience.map((job, i) => (
            <JobCard key={job.company} job={job} index={i} total={experience.length} durationText={durations[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
