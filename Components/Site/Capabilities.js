import { motion } from "framer-motion";
import { languages, toolbox } from "@/data/portfolio";
import s from "@/styles/site/Capabilities.module.css";
import { CoverageViz, CycleList, GherkinViz, MobileViz, PipelineViz, SheetViz } from "./BentoViz";
import { SectionHeader, ease, useTilt } from "./primitives";

function Tile({ className, label, title, desc, children, index }) {
  const tilt = useTilt(4);
  const testId = label.replace(/^\d+\s*—\s*/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <motion.article
      className={`${s.tile} ${className || ""}`}
      data-testid={testId}
      style={tilt.style}
      {...tilt.handlers}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, delay: (index % 4) * 0.08, ease }}
    >
      <header className={s.tileHead}>
        <span className={s.tileLabel}>{label}</span>
        {title && <h3 className={s.tileTitle}>{title}</h3>}
        {desc && <p className={s.tileDesc}>{desc}</p>}
      </header>
      <div className={s.viz}>{children}</div>
    </motion.article>
  );
}

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className={s.section}
    >
      <SectionHeader
        index="04"
        label="Capabilities"
        title={["Tools of the", { text: "trade.", em: true }]}
        intro="The systems I build to make releases predictable — each one running live below."
      />

      <div className={s.grid}>
        <Tile
          index={0}
          className={s.a}
          label="01 — Frameworks"
          title="Keyword-driven automation"
          desc="Test cases live in Excel or Google Sheets and run through Playwright MCP — anyone can add coverage, no code changes needed."
        >
          <SheetViz />
        </Tile>

        <Tile
          index={1}
          className={s.b}
          label="02 — BDD"
          title="Specs that run"
          desc="Selenium + Java + Cucumber suites that product, QA and developers can all read."
        >
          <GherkinViz />
        </Tile>

        <Tile index={2} className={s.c} label="03 — Coverage" title="Coverage that holds">
          <CoverageViz />
        </Tile>

        <Tile index={3} className={s.d} label="04 — Mobile" title="Appium · WebDriverIO">
          <MobileViz />
        </Tile>

        <Tile
          index={4}
          className={s.e}
          label="05 — CI/CD"
          title="Every build, verified"
          desc="Suites wired into Jenkins with parallel execution, video, screenshots and reports."
        >
          <PipelineViz />
        </Tile>

        <Tile index={5} className={s.f} label="06 — Languages">
          <CycleList items={languages} />
        </Tile>

        <Tile index={6} className={s.g} label="07 — Toolbox">
          <div className={s.tools}>
            {toolbox.map((t, i) => (
              <motion.span
                key={t}
                className={s.tool}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.05, ease }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        </Tile>
      </div>
    </section>
  );
}
