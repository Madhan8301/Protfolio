import { useCallback, useEffect, useRef, useState } from "react";
import s from "@/styles/site/Backdrop.module.css";
import LiquidLight from "./LiquidLight";

/*
  The page atmosphere, behind everything (fixed, pointer-events: none):
  - "liquid light" (WebGL) whose palette follows the section in view — CSS colour fields as fallback,
  - a "coverage matrix" of dots that lights up around the pointer, with a test-scan beam
    sweeping down every few seconds,
  - film grain and a vignette.
*/

// Per-section aurora palette (r, g, b). Kept to the site's mint / blue / violet family.
const PALETTES = {
  top: ["61, 220, 151", "110, 195, 255", "92, 110, 255"],
  about: ["45, 212, 191", "61, 220, 151", "110, 195, 255"],
  experience: ["96, 165, 250", "129, 140, 248", "61, 220, 151"],
  frameworks: ["167, 139, 250", "96, 165, 250", "61, 220, 151"],
  capabilities: ["61, 220, 151", "34, 211, 238", "110, 195, 255"],
  work: ["110, 195, 255", "167, 139, 250", "61, 220, 151"],
  achievements: ["255, 196, 90", "61, 220, 151", "110, 195, 255"],
  recognition: ["167, 139, 250", "61, 220, 151", "96, 165, 250"],
  contact: ["61, 220, 151", "95, 240, 173", "110, 195, 255"],
};
const IDS = Object.keys(PALETTES);

const GAP = 30; // dot spacing (px)
const LENS = 190; // pointer light radius (px)
const SCAN_EVERY = 9000;
const SCAN_FOR = 2600;

function Matrix({ tintRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    // The base grid is rendered once to an offscreen canvas and blitted each frame.
    const base = document.createElement("canvas");
    const bctx = base.getContext("2d");
    // Pointer target (m), smoothed position (p) and light strength (k, eased toward kTarget).
    const m = { x: -9999, y: -9999 };
    const p = { x: -9999, y: -9999 };
    let k = 0;
    let kTarget = 0;
    let lastScroll = -1;
    const t0 = performance.now() + 1200;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      base.width = canvas.width;
      base.height = Math.round((h + GAP) * dpr);
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.fillStyle = "rgba(255, 255, 255, 0.07)";
      for (let y = GAP / 2; y < h + GAP; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) bctx.fillRect(x - 0.6, y - 0.6, 1.2, 1.2);
      }
      lastScroll = -1;
    };

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;

      p.x += (m.x - p.x) * 0.16;
      p.y += (m.y - p.y) * 0.16;
      k += (kTarget - k) * 0.08;

      const phase = reduce ? -1 : (now - t0) % SCAN_EVERY;
      const scanning = now > t0 && phase >= 0 && phase < SCAN_FOR;
      const scanY = scanning ? (phase / SCAN_FOR) * (h + 260) - 130 : null;
      const scroll = window.scrollY;
      const moving = Math.abs(m.x - p.x) + Math.abs(m.y - p.y) > 0.5 || Math.abs(kTarget - k) > 0.004;

      // Nothing changed since the last frame → skip the redraw.
      if (!scanning && !moving && scroll === lastScroll && !draw.dirty) return;
      draw.dirty = scanning; // one clean frame after a scan ends
      lastScroll = scroll;

      const off = (scroll * 0.18) % GAP; // the grid drifts slower than the page: depth
      const tint = tintRef.current;
      ctx.clearRect(0, 0, w, h);

      // Base dots: one blit of the pre-rendered grid.
      ctx.drawImage(base, 0, -off, w, h + GAP);

      // Lit dots: near the pointer, or just behind the scan beam.
      const lit = k > 0.01 || scanY !== null;
      if (!lit) return;
      const lensActive = k > 0.01;
      const yMin = Math.min(lensActive ? p.y - LENS : Infinity, scanY !== null ? scanY - 150 : Infinity);
      const yMax = Math.max(lensActive ? p.y + LENS : -Infinity, scanY !== null ? scanY + 4 : -Infinity);
      const inScan = (y) => scanY !== null && y <= scanY + 4 && y >= scanY - 150;
      for (let y = GAP / 2 - off; y < h + GAP; y += GAP) {
        if (y < yMin || y > yMax) continue;
        // Outside the scan band only the lens columns can be lit.
        const full = inScan(y);
        const x0 = full ? GAP / 2 : GAP / 2 + Math.max(0, Math.floor((p.x - LENS) / GAP)) * GAP;
        const x1 = full ? w : Math.min(w, p.x + LENS);
        for (let x = x0; x < x1; x += GAP) {
          let a = 0;
          let size = 1.2;
          if (lensActive) {
            const d = Math.hypot(x - p.x, y - p.y);
            if (d < LENS) {
              const f = (1 - d / LENS) ** 2 * k;
              a += f * 0.75;
              size += f * 2.2;
            }
          }
          if (scanY !== null) {
            const dy = scanY - y;
            if (dy >= 0 && dy < 150) a += (1 - dy / 150) ** 1.6 * 0.5;
          }
          if (a < 0.02) continue;
          ctx.fillStyle = `rgba(${tint}, ${Math.min(a, 0.9)})`;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
      // The beam itself: a thin glowing line.
      if (scanY !== null) {
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, `rgba(${tint}, 0)`);
        g.addColorStop(0.5, `rgba(${tint}, 0.35)`);
        g.addColorStop(1, `rgba(${tint}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, scanY, w, 1);
      }
    };
    draw.dirty = true;

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      if (p.x < -5000) {
        p.x = e.clientX;
        p.y = e.clientY;
      }
      m.x = e.clientX;
      m.y = e.clientY;
      kTarget = 1;
    };
    const onLeave = () => {
      kTarget = 0;
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [tintRef]);

  return <canvas ref={ref} className={s.matrix} />;
}

const toVec = (pal) => pal.map((c) => c.split(",").map((n) => Number(n) / 255));

export default function Backdrop() {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const tintRef = useRef(PALETTES.top[0]);
  const paletteRef = useRef(toVec(PALETTES.top));
  const [gl, setGl] = useState(false);
  const onReady = useCallback((ok) => setGl(ok), []);

  // Palette follows the section crossing the middle of the viewport.
  useEffect(() => {
    const apply = (id) => {
      const pal = PALETTES[id];
      if (!pal) return;
      pal.forEach((c, i) => document.documentElement.style.setProperty(`--aura-${i + 1}`, `rgb(${c})`));
      tintRef.current = pal[0];
      paletteRef.current = toVec(pal);
      window.dispatchEvent(new Event("mk:palette"));
    };
    apply("top");
    const els = IDS.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && apply(e.target.id)),
      { rootMargin: "-48% 0px -48% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Gentle scroll parallax on the aurora (compositor-only transform).
  useEffect(() => {
    const root = rootRef.current;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight || 1;
        const sp = Math.min(1, window.scrollY / max);
        root.style.setProperty("--sp", sp.toFixed(4));
        if (barRef.current) barRef.current.style.transform = `scaleX(${sp.toFixed(4)})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className={s.root} data-gl={gl || undefined} aria-hidden="true">
        <div className={s.aurora}>
          <span className={`${s.blob} ${s.b1}`} />
          <span className={`${s.blob} ${s.b2}`} />
          <span className={`${s.blob} ${s.b3}`} />
        </div>
        <LiquidLight palette={paletteRef} className={s.liquid} onReady={onReady} />
        <Matrix tintRef={tintRef} />
        <div className={s.grain} />
        <div className={s.vignette} />
      </div>
      <div className={s.progress} aria-hidden="true">
        <span ref={barRef} />
      </div>
    </>
  );
}
