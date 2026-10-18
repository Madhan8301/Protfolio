import { useAnimationFrame, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { toolchain } from "@/data/portfolio";
import s from "@/styles/site/Marquee.module.css";

const COPIES = 3;
const TOTAL = toolchain.flat().length;

/*
  One conveyor row. Moves at a calm, constant speed (px/s) — no scroll-velocity tricks.
  Hovering eases it to a stop. Cards passing under the centre scan beam get data-scan="true".
*/
function Row({ tools, speed, onScan, active }) {
  const rowRef = useRef(null);
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const offset = useRef(0);
  const factor = useRef(1);
  const target = useRef(1);
  const geo = useRef({ copy: 0, chips: [] });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild;
    geo.current.copy = first ? first.getBoundingClientRect().width : 0;
    geo.current.chips = Array.from(track.querySelectorAll("[data-chip]")).map((el) => ({
      el,
      center: el.offsetLeft + el.offsetWidth / 2,
      half: el.offsetWidth / 2,
      name: el.dataset.chip,
    }));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  useAnimationFrame((_, delta) => {
    const { copy, chips } = geo.current;
    if (!copy || !active) return;
    const dt = Math.min(delta, 50) / 1000;
    if (!reduce) {
      factor.current += (target.current - factor.current) * (1 - Math.exp(-dt * 5));
      offset.current = (((offset.current + speed * factor.current * dt) % copy) + copy) % copy;
    }
    const x = -offset.current;
    trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;

    const mid = rowRef.current.clientWidth / 2;
    for (const c of chips) {
      const on = Math.abs(c.center + x - mid) < c.half;
      if ((c.el.dataset.scan === "true") !== on) {
        c.el.dataset.scan = on;
        if (on) onScan(c.name);
      }
    }
  });

  return (
    <div
      ref={rowRef}
      className={s.row}
      onPointerEnter={(e) => e.pointerType === "mouse" && (target.current = 0)}
      onPointerLeave={() => (target.current = 1)}
    >
      <div ref={trackRef} className={s.track}>
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul key={copy} className={s.copy} aria-hidden={copy > 0 || undefined}>
            {tools.map((t) => (
              <li
                key={t.name}
                className={s.chip}
                data-chip={t.name}
                style={{ "--brand": t.color }}
              >
                <span className={s.mark}>
                  <img src={t.logo} alt="" width="28" height="28" draggable="false" />
                </span>
                <span className={s.text}>
                  <b>{t.name}</b>
                  <small>{t.kind}</small>
                </span>
                <span className={s.tick} aria-hidden="true">
                  ✓
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "100px 0px" });
  const [verified, setVerified] = useState(() => new Set());
  const [last, setLast] = useState("");

  const onScan = useCallback((name) => {
    setLast(name);
    setVerified((prev) => (prev.has(name) ? prev : new Set(prev).add(name)));
  }, []);

  const done = verified.size === TOTAL;

  return (
    <section ref={ref} className={s.marquee} aria-label="Tools I work with">
      <div className={s.head}>
        <span className={s.headLeft}>
          <span className={`${s.led} ${done ? s.ledDone : ""}`} />
          toolchain.config
        </span>
        <span className={s.headMid} aria-hidden="true">
          {last ? (
            <>
              scanning <b>{last}</b>
            </>
          ) : (
            "starting scan…"
          )}
        </span>
        <span className={`${s.headRight} ${done ? s.ok : ""}`} aria-live="polite">
          {done ? `✓ all ${TOTAL} tools verified` : `verified ${verified.size}/${TOTAL}`}
        </span>
      </div>

      <div className={s.stage}>
        <span className={s.beam} aria-hidden="true" />
        <Row tools={toolchain[0]} speed={64} onScan={onScan} active={inView} />
        <Row tools={toolchain[1]} speed={-50} onScan={onScan} active={inView} />
      </div>
    </section>
  );
}
