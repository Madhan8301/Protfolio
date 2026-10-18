import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import s from "@/styles/site/Contact.module.css";
import ui from "@/styles/site/ui.module.css";
import { ArrowIcon, Magnetic, RevealText, RollText, ease, useLocalTime } from "./primitives";

export default function Contact() {
  const time = useLocalTime(profile.timezone);
  const [copied, setCopied] = useState(false);
  // Observe the wordmark row itself: each letter starts clipped by its mask, so it never "intersects".
  const wmRef = useRef(null);
  const wmIn = useInView(wmRef, { once: true, amount: 0.25 });
  const wordmark = `${profile.firstName} ${profile.lastName}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      id="contact"
      className={s.section}
    >
      <div className={s.inner}>
        <motion.div
          className={s.top}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <span className={s.spec}>
            <b>08</b> contact.spec.ts <i>✓ all tests passed</i>
          </span>
          <span>
            {profile.location} · {time} IST
          </span>
        </motion.div>

        <RevealText parts={["Let's make your next release", { text: "boringly reliable.", em: true }]} className={s.title} emClass={s.titleEm} />

        <div className={s.lineRow}>
          <motion.span
            className={s.line}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease }}
          />
          <Magnetic strength={0.4} className={s.circleWrap}>
            <a href={`mailto:${profile.email}`} className={s.circle}>
              <span className={s.circleFill} />
              <span className={s.circleText}>
                Get in
                <br />
                touch
              </span>
            </a>
          </Magnetic>
        </div>

        <div className={s.actions}>
          <Magnetic>
            <button
              type="button"
              onClick={copy}
              className={`${ui.btn} ${ui.btnGhost} ${ui.btnLg}`}
              data-cursor={copied ? "Copied" : "Copy"}
            >
              <span className={ui.btnLabel}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "email"}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "inline-block" }}
                  >
                    {copied ? "Copied to clipboard ✓" : profile.email}
                  </motion.span>
                </AnimatePresence>
              </span>
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className={`${ui.btn} ${ui.btnGhost} ${ui.btnLg}`}
            >
              <span className={ui.btnLabel}>{profile.phone}</span>
            </a>
          </Magnetic>
        </div>
      </div>

      <footer className={s.footer}>
        <div className={s.col}>
          <span className={s.label}>Version</span>
          <span suppressHydrationWarning>{new Date().getFullYear()} © Madhan Kumar</span>
        </div>
        <div className={s.col}>
          <span className={s.label}>Local time</span>
          <span>{time} IST</span>
        </div>
        <div className={s.col}>
          <span className={s.label}>Socials</span>
          <span className={s.socials}>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <RollText text="LinkedIn" />
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <RollText text="GitHub" />
            </a>
            <a href={profile.resume} target="_blank" rel="noreferrer">
              <RollText text="Résumé" />
            </a>
          </span>
        </div>
        <a href="#top" className={s.top2}>
          <RollText text="Back to top" />
          <ArrowIcon className={s.up} />
        </a>
      </footer>

      {/* Giant sign-off wordmark: letters rise in, each lifts on hover. */}
      <div ref={wmRef} className={s.wordmark} aria-hidden="true">
        {Array.from(wordmark).map((c, i) => (
          <span key={i} className={s.wmMask}>
            <motion.span
              className={s.wmChar}
              data-space={c === " " || undefined}
              initial={{ y: "102%" }}
              animate={{ y: wmIn ? "0%" : "102%" }}
              transition={{ duration: 1.3, delay: i * 0.045, ease }}
            >
              {c === " " ? "\u00a0" : c}
            </motion.span>
          </span>
        ))}
      </div>
    </section>
  );
}
