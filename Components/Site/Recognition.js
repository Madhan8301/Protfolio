import { credentials } from "@/data/portfolio";
import s from "@/styles/site/Recognition.module.css";
import { SectionHeader, TiltCard } from "./primitives";

const icons = {
  Publication: "✎",
  Certification: "✓",
  Education: "◎",
};

export default function Recognition() {
  return (
    <section id="recognition" className={s.section}>
      <SectionHeader index="07" label="Credentials" title={["Proof of", { text: "craft.", em: true }]} />

      <div className={s.grid}>
        {credentials.map((c, i) => (
          <TiltCard key={c.title} as="article" className={`${s.item} ${c.type === "Education" ? s.wide : ""}`} delay={(i % 3) * 0.07} max={7}>
            <div className={s.top}>
              <span className={s.icon} aria-hidden="true">
                {icons[c.type] || "•"}
              </span>
              <span className={s.type}>{c.type}</span>
              {c.year && <span className={s.year}>{c.year}</span>}
            </div>
            <h3 className={s.title}>{c.title}</h3>
            <p className={s.issuer}>{c.issuer}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
