import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import s from "@/styles/site/Nav.module.css";
import ui from "@/styles/site/ui.module.css";
import { ArrowIcon, Magnetic, RollText, ease, easeInOut, useLocalTime, useMediaQuery } from "./primitives";
import { lockScroll } from "./SmoothScroll";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#frameworks", label: "Frameworks" },
  { href: "#capabilities", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
];

const socials = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
  { label: "Résumé", href: profile.resume },
  { label: "Email", href: `mailto:${profile.email}` },
];

function MenuCurve() {
  const [h, setH] = useState(0);
  useEffect(() => setH(window.innerHeight), []);
  if (!h) return null;
  const initialPath = `M100 0 L100 ${h} Q-100 ${h / 2} 100 0`;
  const targetPath = `M100 0 L100 ${h} Q100 ${h / 2} 100 0`;
  return (
    <svg className={s.curve} aria-hidden="true">
      <motion.path
        initial={{ d: initialPath }}
        animate={{ d: targetPath, transition: { duration: 1, ease: easeInOut } }}
        exit={{ d: initialPath, transition: { duration: 0.8, ease: easeInOut } }}
      />
    </svg>
  );
}

export default function Nav({ ready = true }) {
  const [hidden, setHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const time = useLocalTime(profile.timezone);
  const compactLayout = useMediaQuery("(max-width: 1100px)");
  const buttonRef = useRef(null);
  const firstLinkRef = useRef(null);
  const openRef = useRef(false);

  const setMenu = useCallback((next) => {
    if (openRef.current === next) return;
    openRef.current = next;
    lockScroll("menu", next);
    setOpen(next);
  }, []);

  // Never leave the page locked if the nav unmounts with the menu open.
  useEffect(() => () => lockScroll("menu", false), []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setPastHero(y > window.innerHeight * 0.7);
      if (y < 120) setHidden(false);
      else if (y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    firstLinkRef.current?.focus({ preventScroll: true });
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenu(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setMenu]);

  // Desktop: the floating button takes over only while the header is tucked away.
  const showFab = open || compactLayout || (pastHero && hidden);

  return (
    <>
      <motion.header
        className={s.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: !ready || (hidden && !open) ? -100 : 0, opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <a href="#top" className={s.brand} aria-label={`${profile.name} — back to top`}>
          <img src="/assets/logo.png" alt="" className={s.logo} />
          <span className={s.brandRoll}>
            <span>Madhan Kumar</span>
            <span>Automation QA</span>
          </span>
        </a>

        <nav aria-label="Primary" className={s.links}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className={active === l.href ? s.active : ""} aria-current={active === l.href ? "location" : undefined}>
              <RollText text={l.label} />
            </a>
          ))}
        </nav>

        <div className={s.right}>
          <span className={s.clock}>
            <span className={s.clockDot} />
            {time} <span className={s.tz}>IST</span>
          </span>
          <Magnetic strength={0.25}>
            <a href="#contact" className={`${ui.btn} ${ui.btnAccent} ${ui.btnSm}`}>
              <span className={ui.btnLabel}>Let&apos;s talk</span>
              <ArrowIcon className={ui.btnIcon} />
            </a>
          </Magnetic>
        </div>
      </motion.header>

      <motion.div
        className={s.fabWrap}
        initial={false}
        animate={{ scale: showFab && ready ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <Magnetic strength={0.35}>
          <button
            ref={buttonRef}
            type="button"
            className={s.fab}
            data-open={open}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setMenu(!open)}
          >
            <span className={s.burger} />
          </button>
        </Magnetic>
      </motion.div>

      <AnimatePresence mode="wait">
        {open && (
          <>
            <motion.div
              key="backdrop"
              className={s.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => setMenu(false)}
            />
            <motion.aside
              key="menu"
              id="site-menu"
              className={s.menu}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "calc(100% + 100px)" }}
              animate={{ x: 0 }}
              exit={{ x: "calc(100% + 100px)" }}
              transition={{ duration: 0.8, ease: easeInOut }}
            >
              <MenuCurve />
              <div className={s.menuBody}>
                <p className={s.menuLabel}>Navigation</p>
                <ul className={s.menuLinks}>
                  {links.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ x: 80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 80, opacity: 0 }}
                      transition={{ duration: 0.7, delay: 0.12 + i * 0.05, ease: easeInOut }}
                    >
                      <a
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={l.href}
                        className={active === l.href ? s.menuActive : ""}
                        onClick={() => setMenu(false)}
                      >
                        <span className={s.menuIndex}>0{i + 1}</span>
                        <RollText text={l.label} />
                      </a>
                    </motion.li>
                  ))}
                </ul>
                <div className={s.menuFoot}>
                  <p className={s.menuLabel}>Socials</p>
                  <div className={s.menuSocials}>
                    {socials.map((x) => (
                      <a key={x.label} href={x.href} target={x.href.startsWith("http") || x.href.endsWith(".pdf") ? "_blank" : undefined} rel="noreferrer">
                        <RollText text={x.label} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
