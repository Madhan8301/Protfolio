import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { projects } from "@/data/portfolio";
import s from "@/styles/site/Work.module.css";
import { ArrowIcon, SectionHeader, ease } from "./primitives";

function Cover({ cover, title }) {
  if (cover.kind === "image") {
    return (
      <div className={`${s.cover} ${s.coverImage}`}>
        <div className={s.chrome}>
          <span />
          <span />
          <span />
        </div>
        <img src={cover.src} alt="" loading="lazy" />
      </div>
    );
  }
  if (cover.kind === "sheet") {
    return (
      <div className={`${s.cover} ${s.coverSheet}`}>
        <span className={s.coverKicker}>keywords.xlsx</span>
        <div className={s.miniSheet}>
          {["OpenURL", "Click", "Fill", "Verify", "Screenshot"].map((k) => (
            <span key={k}>
              <b>{k}</b>
              <i>✓</i>
            </span>
          ))}
        </div>
        <span className={s.coverTitle}>{title}</span>
      </div>
    );
  }
  if (cover.kind === "report") {
    return (
      <div className={`${s.cover} ${s.coverReport}`}>
        <div className={s.rBar}>
          <span className={s.rLogo}>»</span>
          <span>execution-report.html</span>
          <span className={s.rChip}>PDF</span>
        </div>
        <div className={s.rBody}>
          <svg viewBox="0 0 42 42" className={s.rDonut} aria-hidden="true">
            <circle cx="21" cy="21" r="16" pathLength="100" />
            <circle cx="21" cy="21" r="16" pathLength="100" strokeDasharray="94 100" />
          </svg>
          <div className={s.rRows}>
            {[
              ["Passed", 94, "#22c55e"],
              ["Failed", 4, "#ef4444"],
              ["Skipped", 2, "#f5b301"],
            ].map(([k, v, c]) => (
              <span key={k}>
                <b>{k}</b>
                <i style={{ "--w": `${Math.max(v, 6)}%`, "--c": c }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`${s.cover} ${s.coverShield}`}>
      <svg viewBox="0 0 64 72" className={s.shield} aria-hidden="true">
        <path d="M32 2 60 12v22c0 18-12 30-28 36C16 64 4 52 4 34V12L32 2Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="m20 36 8 8 16-17" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={s.coverStat}>95% coverage · web + mobile</span>
      <span className={s.coverTitle}>{title}</span>
    </div>
  );
}

export default function Work() {
  const listRef = useRef(null);
  const [preview, setPreview] = useState({ on: false, index: 0 });
  // Preview position inside the list (px). It sits in the right-hand lane of the hovered row,
  // over the org/type column, so it never covers the title, description or tags.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });
  const tilt = useMotionValue(0);
  const rotate = useSpring(tilt, { stiffness: 150, damping: 18 });

  const place = (row, jump) => {
    const list = listRef.current;
    const lane = row.querySelector("[data-lane]");
    if (!list || !lane) return;
    const l = list.getBoundingClientRect();
    const a = lane.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const nx = a.left - l.left + a.width / 2;
    const ny = r.top - l.top + r.height / 2;
    if (jump) {
      sx.jump(nx);
      sy.jump(ny);
    }
    x.set(nx);
    y.set(ny);
  };

  const onEnter = (e, index) => {
    if (e.pointerType === "touch") return;
    place(e.currentTarget, !preview.on);
    setPreview({ on: true, index });
  };

  // A gentle tilt toward the pointer keeps the preview feeling alive without chasing it.
  const onMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    tilt.set(((e.clientX - r.left) / r.width - 0.5) * 8);
  };

  const onLeave = () => {
    tilt.set(0);
    setPreview((p) => ({ ...p, on: false }));
  };

  return (
    <section
      id="work"
      className={s.section}
    >
      <SectionHeader
        index="05"
        label="Selected work"
        title={["Things I've", { text: "built.", em: true }]}
        intro="Frameworks, client projects and side-builds — from spreadsheets that drive Playwright to a mouse you control with your hand."
      />

      <div ref={listRef} className={s.list} data-previewing={preview.on} onPointerMove={onMove} onPointerLeave={onLeave}>
        {projects.map((p, i) => {
          const Row = p.link ? "a" : "div";
          const linkProps = p.link ? { href: p.link, target: "_blank", rel: "noreferrer", "data-cursor": "Open" } : {};
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: i * 0.05, ease }}
            >
              <Row className={s.row} {...linkProps} onPointerEnter={(e) => onEnter(e, i)}>
                <span className={s.idx}>{String(i + 1).padStart(2, "0")}</span>
                <div className={s.main}>
                  <div className={s.mobileCover}>
                    <Cover cover={p.cover} title={p.title} />
                  </div>
                  <h3 className={s.title}>{p.title}</h3>
                  <p className={s.desc}>{p.description}</p>
                  <div className={s.tags}>
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className={s.meta} data-lane="">
                  <span>{p.org}</span>
                  <span>{p.type}</span>
                </div>
                <span className={s.arrow} aria-hidden="true">
                  {p.link ? <ArrowIcon /> : <span className={s.dot} />}
                </span>
              </Row>
            </motion.div>
          );
        })}
        <motion.div className={s.previewPos} style={{ x: sx, y: sy }} aria-hidden="true">
          <motion.div
            className={s.preview}
            style={{ rotate }}
            initial={false}
            animate={{ scale: preview.on ? 1 : 0.6, opacity: preview.on ? 1 : 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className={s.slider} style={{ transform: `translateY(${-preview.index * 100}%)` }}>
              {projects.map((p) => (
                <Cover key={p.title} cover={p.cover} title={p.title} />
              ))}
            </div>
            <div className={s.previewFoot}>
              <span>{projects[preview.index].org}</span>
              <span>{projects[preview.index].link ? "Open on GitHub ↗" : projects[preview.index].type}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
