import Lenis from "lenis";
import { useEffect } from "react";

export const smooth = { lenis: null };

/*
  Named scroll locks ("intro", "menu"). Locking the same name twice is a no-op, so React StrictMode
  running effects twice in development can never leave the page stuck — the bug a plain counter had.
*/
const holders = new Set();

function applyLock() {
  const locked = holders.size > 0;
  if (smooth.lenis) {
    if (locked) smooth.lenis.stop();
    else smooth.lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function lockScroll(name, lock) {
  if (lock) holders.add(name);
  else holders.delete(name);
  applyLock();
}

export function scrollToHash(hash) {
  const target = hash === "#top" ? 0 : document.querySelector(hash);
  if (target === null) return false;
  // Respect CSS scroll-margin-top so targets aren't flush with the top edge.
  const offset = target === 0 ? 0 : -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
  if (smooth.lenis) {
    smooth.lenis.scrollTo(target, { offset, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), force: true });
  } else if (target === 0) {
    window.scrollTo({ top: 0 });
  } else {
    target.scrollIntoView();
  }
  if (target !== 0) {
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
  return true;
}

export default function SmoothScroll() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (!link) return;
      const hash = link.getAttribute("href");
      if (hash.length < 2) return;
      if (scrollToHash(hash)) {
        e.preventDefault();
        history.replaceState(null, "", hash === "#top" ? window.location.pathname : hash);
      }
    };
    document.addEventListener("click", onClick);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return () => document.removeEventListener("click", onClick);

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    smooth.lenis = lenis;
    applyLock();

    let raf = requestAnimationFrame(function frame(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      smooth.lenis = null;
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
