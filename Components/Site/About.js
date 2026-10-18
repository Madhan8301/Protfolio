import { motion } from "framer-motion";
import { experience, profile } from "@/data/portfolio";
import s from "@/styles/site/About.module.css";
import ui from "@/styles/site/ui.module.css";
import { ScrollText, SectionHeader, ease, useTilt } from "./primitives";

const current = experience.find((job) => job.current);
const previous = experience.filter((job) => !job.current);

// "Dec 2022 — May 2025" → "2022 — 2025", "Mar 2022 — Oct 2022" → "2022"
const years = (period) => {
  const [from, to] = period.match(/\d{4}/g) || [];
  return from === to || !to ? from : `${from} — ${to}`;
};

export default function About() {
  const tilt = useTilt(6);
  return (
    <section
      id="about"
      className={s.about}
    >
      <SectionHeader index="01" label="About" title={["Quality is a", { text: "feature.", em: true }]} />

      <div className={s.grid}>
        <aside className={s.side}>
          <motion.div
            className={`${ui.fx} ${s.now}`}
            style={tilt.style}
            {...tilt.handlers}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease }}
          >
            <p className={s.nowLabel}>
              <span className={s.pulse} /> Now
            </p>
            <div className={s.nowRow}>
              <span className={s.nowLogo}>
                <img src={current.logo} alt="" />
              </span>
              <div>
                <p className={s.nowRole}>{current.role}</p>
                <p className={s.nowMeta}>
                  {current.company} · since {current.period.split(" — ")[0]}
                </p>
              </div>
            </div>
            <p className={s.nowLabel}>Previously</p>
            <ul className={s.prev}>
              {previous.map((job) => (
                <li key={job.company}>
                  <span>{job.company}</span>
                  <span>{years(job.period)}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </aside>

        <div className={s.main}>
          <ScrollText parts={profile.about.lead} className={s.lead} />
          <div className={s.body}>
            {profile.about.body.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, delay: i * 0.12, ease }}
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
