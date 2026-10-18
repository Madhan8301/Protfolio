import Head from "next/head";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import About from "@/Components/Site/About";
import Achievements from "@/Components/Site/Achievements";
import Capabilities from "@/Components/Site/Capabilities";
import Contact from "@/Components/Site/Contact";
import Experience from "@/Components/Site/Experience";
import Frameworks from "@/Components/Site/Frameworks";
import Hero from "@/Components/Site/Hero";
import Marquee from "@/Components/Site/Marquee";
import MouseFx from "@/Components/Site/MouseFx";
import Nav from "@/Components/Site/Nav";
import Preloader from "@/Components/Site/Preloader";
import Recognition from "@/Components/Site/Recognition";
import SmoothScroll, { lockScroll } from "@/Components/Site/SmoothScroll";
import TestRunner from "@/Components/Site/TestRunner";
import Work from "@/Components/Site/Work";
import { profile } from "@/data/portfolio";
import ui from "@/styles/site/ui.module.css";

const INTRO_KEY = "mk-intro-seen";

export default function Home() {
  // null = deciding (first paint), true = preloader running, false = site ready
  const [intro, setIntro] = useState(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setIntro(false);
      return undefined;
    }
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lockScroll("intro", true);
    setIntro(true);
    // Release on unmount too, so StrictMode's mount → unmount → mount in development can't leave it locked.
    return () => lockScroll("intro", false);
  }, []);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    lockScroll("intro", false);
    setIntro(false);
  }, []);

  const ready = intro === false;

  useEffect(() => {
    if (!ready) return;
    window.__portfolioReady = true;
    window.dispatchEvent(new Event("portfolio:ready"));
  }, [ready]);

  const description = `${profile.name} — ${profile.role}. ${profile.intro}`;

  return (
    <MotionConfig reducedMotion="user">
      <Head>
        <title>{`${profile.name} — ${profile.role}`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0c10" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${profile.name} — ${profile.role}`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SmoothScroll />
      <AnimatePresence mode="wait">{intro && <Preloader key="preloader" onDone={finishIntro} />}</AnimatePresence>
      {intro === null && <div className={ui.curtain} aria-hidden="true" />}
      <MouseFx />
      <Nav ready={ready} />
      <TestRunner ready={ready} />

      <main className={ui.main}>
        <Hero ready={ready} />
        <About />
        <Marquee />
        <Experience />
        <Frameworks />
        <Capabilities />
        <Work />
        <Achievements />
        <Recognition />
        <Contact />
      </main>
    </MotionConfig>
  );
}
