import { useEffect, useRef } from "react";

/*
  "Liquid light": a full-screen WebGL fragment shader of domain-warped noise, tinted with the current
  section palette. The pointer bends the flow like a lens and leaves a soft glow; scrolling drifts it.
  Rendered at a fraction of the CSS resolution (the field is soft, so it upscales cleanly) and paused
  when the tab is hidden. Reduced motion → one still frame, redrawn only when the palette changes.
  Calls onReady(false) when WebGL is unavailable so the caller can keep its CSS fallback.
*/

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
uniform float uMouseK;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 1.35;
  vec2 m = vec2(uMouse.x * aspect, uMouse.y) * 1.35;

  // Pointer lens: push the field away from the cursor.
  vec2 dm = p - m;
  float lens = exp(-dot(dm, dm) * 5.0) * uMouseK;
  p += dm * lens * 0.35;

  float t = uTime * 0.045;
  p.y -= uScroll * 0.9;

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 1.2));
  float f = fbm(p + 2.6 * r);

  vec3 col = mix(uC1, uC2, smoothstep(0.25, 0.85, q.x));
  col = mix(col, uC3, smoothstep(0.35, 0.95, r.y));

  // Ribbons of light with dark water between them.
  float veil = smoothstep(0.42, 0.92, f) * (0.55 + 0.45 * smoothstep(0.2, 0.9, length(r)));
  // Brighter towards the top of the screen, calmer behind body text lower down.
  float shape = mix(0.55, 1.0, smoothstep(0.0, 1.0, uv.y));

  vec3 base = vec3(0.039, 0.047, 0.063);
  vec3 c = base + col * veil * shape * 0.4;
  // Thin bright filaments along the ridges.
  c += mix(col, vec3(1.0), 0.25) * pow(smoothstep(0.58, 0.98, f), 3.0) * 0.26;
  // Soft glow following the pointer.
  c += uC1 * lens * 0.07;

  // Vignette.
  vec2 v = uv - 0.5;
  c *= 1.0 - dot(v, v) * 0.9;
  gl_FragColor = vec4(c, 1.0);
}
`;

const SCALE = 0.42; // render resolution relative to CSS pixels

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== "production") console.warn("[LiquidLight]", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function LiquidLight({ palette, className, onReady }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" });
    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!gl || !vs || !fs) {
      onReady?.(false);
      return undefined;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      onReady?.(false);
      return undefined;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(
      ["uRes", "uTime", "uScroll", "uMouse", "uMouseK", "uC1", "uC2", "uC3"].map((n) => [n, gl.getUniformLocation(prog, n)])
    );

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cur = palette.current.map((c) => c.slice());
    const mouse = { x: 0.5, y: 0.6, tx: 0.5, ty: 0.6, k: 0, tk: 0 };
    let raf = 0;
    let scroll = 0;
    const t0 = performance.now();

    const resize = () => {
      canvas.width = Math.max(1, Math.round(window.innerWidth * SCALE));
      canvas.height = Math.max(1, Math.round(window.innerHeight * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (reduce) render(0);
    };

    const render = (now) => {
      // Ease the palette toward the target colours of the section in view.
      let moving = false;
      palette.current.forEach((target, i) =>
        target.forEach((v, j) => {
          const d = v - cur[i][j];
          if (Math.abs(d) > 0.001) moving = true;
          cur[i][j] += reduce ? d : d * 0.035;
        })
      );
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      mouse.k += (mouse.tk - mouse.k) * 0.04;
      scroll += (window.scrollY / window.innerHeight - scroll) * (reduce ? 1 : 0.08);

      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform1f(u.uTime, reduce ? 12 : (now - t0) / 1000);
      gl.uniform1f(u.uScroll, scroll * 0.35);
      gl.uniform2f(u.uMouse, mouse.x, mouse.y);
      gl.uniform1f(u.uMouseK, mouse.k);
      gl.uniform3fv(u.uC1, cur[0]);
      gl.uniform3fv(u.uC2, cur[1]);
      gl.uniform3fv(u.uC3, cur[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return moving;
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!document.hidden) render(now);
    };

    // Reduced motion: redraw only while the palette is gliding to a new section.
    let still = 0;
    const settle = () => {
      cancelAnimationFrame(still);
      still = requestAnimationFrame(function step() {
        if (render(0)) still = requestAnimationFrame(step);
      });
    };

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
      mouse.tk = 1;
    };
    const onLeave = () => {
      mouse.tk = 0;
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) {
      window.addEventListener("mk:palette", settle);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }
    onReady?.(true);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(still);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mk:palette", settle);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      // Don't force-lose the context: React StrictMode re-runs this effect on the same canvas.
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [palette, onReady]);

  return <canvas ref={ref} className={className} />;
}
