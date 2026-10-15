"use client";

import { useEffect, useRef } from "react";

const N = 70000;
const SCENE_VH = 2; // fallback height of a Scene when a section id can't be found

let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const gauss = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
const TAU = Math.PI * 2;

// Binary tree layout (kept for kind 1, no longer in the scroll sequence)
const TREE: [number, number][] = [];
for (let l = 0; l < 4; l++) {
  for (let k = 0; k < 2 ** l; k++) TREE.push([((k + 0.5) / 2 ** l) * 3.8 - 1.9, 1.35 - l * 0.9]);
}

const rotX = (y: number, z: number, a: number): [number, number] => [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];

// 0 neural core · 1 algorithm tree (unused) · 2 browser grid · 3 orbiting nodes · 4 ingot · 5 uniform scatter
function build(kind: number) {
  const a = new Float32Array(N * 3);

  for (let i = 0; i < N; i++) {
    let x = 0, y = 0, z = 0;
    const th = rnd() * TAU;

    if (kind === 0) {
      // Neural Core: a spherical shell, denser inner neural clusters, and radial sparks.
      const mode = rnd();
      if (mode < 0.66) {
        const u = rnd() * 2 - 1;
        const phi = rnd() * TAU;
        const shell = 1.08 + gauss() * 0.045;
        const planar = Math.sqrt(Math.max(0, 1 - u * u));
        x = shell * planar * Math.cos(phi);
        y = shell * u;
        z = shell * planar * Math.sin(phi);
      } else if (mode < 0.9) {
        const cluster = Math.floor(rnd() * 9);
        const lat = Math.acos(1 - 2 * ((cluster + 0.5) / 9));
        const lon = cluster * 2.399963229728653;
        const centerX = 0.52 * Math.sin(lat) * Math.cos(lon);
        const centerY = 0.52 * Math.cos(lat);
        const centerZ = 0.52 * Math.sin(lat) * Math.sin(lon);
        x = centerX + gauss() * 0.17;
        y = centerY + gauss() * 0.17;
        z = centerZ + gauss() * 0.17;
      } else {
        const r = Math.pow(rnd(), 1.8) * 0.42;
        const u = rnd() * 2 - 1;
        const phi = rnd() * TAU;
        const planar = Math.sqrt(Math.max(0, 1 - u * u));
        x = r * planar * Math.cos(phi);
        y = r * u;
        z = r * planar * Math.sin(phi);
      }
    } else if (kind === 1) {
      if (rnd() < 0.4) {
        const n = TREE[Math.floor(rnd() * 15)];
        x = n[0] + gauss() * 0.1; y = n[1] + gauss() * 0.1; z = gauss() * 0.1;
      } else {
        const idx = 1 + Math.floor(rnd() * 14), n = TREE[idx], pr = TREE[Math.floor((idx - 1) / 2)], t2 = rnd();
        x = pr[0] + (n[0] - pr[0]) * t2 + gauss() * 0.02;
        y = pr[1] + (n[1] - pr[1]) * t2 + gauss() * 0.02;
        z = gauss() * 0.05;
      }
    } else if (kind === 2) {
      const W = 3.6, H = 2.4;
      if (rnd() < 0.5) { x = (Math.floor(rnd() * 10) / 9 - 0.5) * W; y = (rnd() - 0.5) * H; }
      else { x = (rnd() - 0.5) * W; y = (Math.floor(rnd() * 7) / 6 - 0.5) * H; }
      x += gauss() * 0.012; y += gauss() * 0.012;
      [y, z] = rotX(y, 0, 0.9);
      const c = Math.cos(0.45), s = Math.sin(0.45);
      [x, z] = [x * c + z * s, -x * s + z * c];
    } else if (kind === 3) {
      const r = Math.floor(rnd() * 3), R = 0.9 + r * 0.5;
      if (rnd() < 0.3) {
        const t2 = (Math.floor(rnd() * 5) / 5) * TAU + r * 0.7;
        x = R * Math.cos(t2) + gauss() * 0.09;
        z = R * Math.sin(t2) + gauss() * 0.09;
        y = gauss() * 0.09;
      } else {
        x = R * Math.cos(th) + gauss() * 0.02;
        z = R * Math.sin(th) + gauss() * 0.02;
        y = gauss() * 0.02;
      }
      [y, z] = rotX(y, z, [0.5, -0.9, 1.4][r]);
      const c = Math.cos(r), s = Math.sin(r);
      [x, y] = [x * c - y * s, x * s + y * c];
    } else if (kind === 4) {
      const w = 1.9, h = 0.6, d = 1.0, q = rnd() * 3.64;
      const ax = q < 0.6 ? 0 : q < 2.5 ? 1 : 2, sg = rnd() < 0.5 ? -1 : 1;
      let u = rnd() * 2 - 1, v = rnd() * 2 - 1, wv = rnd() * 2 - 1;
      if (ax === 0) u = sg; else if (ax === 1) v = sg; else wv = sg;
      x = u * w; y = v * h; z = wv * d;
      const k = 1 - 0.28 * ((y / h + 1) / 2); x *= k; z *= k;
      [y, z] = rotX(y, z, -0.45);
    } else {
      // Uniform scatter: a wide, shallow slab that fills the viewport evenly. The shader
      // widens it for ultrawide screens and thins it out for small ones.
      x = (rnd() * 2 - 1) * 4.8;
      y = (rnd() * 2 - 1) * 2.9;
      z = (rnd() * 2 - 1) * 1.1;
    }
    a.set([x, y, z], i * 3);
  }
  return a;
}

const VS = `
attribute vec3 aA; attribute vec3 aB; attribute float aS;
uniform float uT, uTime, uAsp, uDpr, uIntro, uVel, uF, uCalm; uniform vec2 uM;
varying vec3 vC; varying float vA;
float h(float x){ return fract(sin(x*12.9898)*43758.5453); }
void main(){
  float d = clamp(uT*1.6 - aS*0.6, 0.0, 1.0); d = d*d*(3.0-2.0*d);
  vec3 p = mix(aA, aB, d);
  vec3 n = vec3(h(aS*3.1)-.5, h(aS*7.7)-.5, h(aS*11.3)-.5) * vec3(7.0,5.0,3.0);
  float ie = clamp(uIntro*1.4 - aS*0.4, 0.0, 1.0); ie = 1.0 - pow(1.0-ie, 3.0);
  p = mix(n, p, ie);
  // Scatter state: stretch to the screen's aspect so it always reaches the edges.
  p.x *= mix(1.0, clamp(uAsp/1.78, 0.3, 1.6), uCalm);
  float fl = sin(d*3.14159);
  p += vec3(sin(p.y*2.2+uTime*.5+aS*6.28), cos(p.x*2.2+uTime*.4+aS*5.0), sin(p.z*2.0+p.x*1.5+uTime*.3)) * (fl*0.55 + 0.025);
  float sw = fl*1.2*(aS-0.5); float cs = cos(sw), sn = sin(sw);
  p.xz = vec2(p.x*cs - p.z*sn, p.x*sn + p.z*cs);
  // Slow ambient sway plus a scroll-driven angle (uF, in radians).
  float a = sin(uTime*.25)*.35 + uF; float c = cos(a), s = sin(a);
  p = vec3(p.x*c + p.z*s, p.y, -p.x*s + p.z*c);
  // Cursor interaction: a soft force field pushes nearby particles away from the pointer.
  vec2 dm = p.xy - uM*vec2(uAsp,1.0)*2.4;
  float mouseForce = exp(-dot(dm,dm)*3.0);
  p.xy += normalize(dm+1e-4) * 0.22 * mouseForce;
  float z = p.z + 4.3 - 0.9*fl, k = 1.7/z;
  gl_Position = vec4(p.x*k/uAsp, p.y*k, 0.0, 1.0);
  gl_PointSize = (1.1 + aS*1.7) * uDpr * (4.0/z) * (1.0 + uVel + mouseForce*0.12);
  vC = mix(vec3(1.0,.32,.04), vec3(1.0,.78,.35), .5+.5*sin(p.x*1.3+p.y*.9+aS*2.0));
  vC = mix(vC, vec3(1.0,.88,.62), mouseForce*.28);
  vC = mix(vC, vec3(.95,.25,.35), smoothstep(.6,1.,aS)*.35);
  // Scatter state: thin the cloud (more on small screens) and soften it so content reads on top.
  float keep = 0.55*clamp(uAsp/1.78, 0.3, 1.0);
  float vis = 1.0 - uCalm*step(keep, h(aS*91.7+3.0));
  vA = (.42 + uVel*.25 + mouseForce*.12) * (1.0 - uCalm*.2) * vis;
}`;

const FS = `
precision mediump float; varying vec3 vC; varying float vA;
void main(){ float r = length(gl_PointCoord-.5); if(r>.5) discard; gl_FragColor = vec4(vC, (1.-r*2.)*vA); }`;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / Math.max(1e-6, b - a)));
  return t * t * (3 - 2 * t);
};

export default function ParticleField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sh = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("ParticleField shader compile error:", gl.getShaderInfoLog(shader));
      }
      return shader;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      console.error("ParticleField program link error:", gl.getProgramInfoLog(pr));
      return;
    }
    gl.useProgram(pr);

    const buf = (data: Float32Array) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    };
    // sequence: core -> scatter (features) -> browser grid (extension) -> orbit -> ingot
    const shapes = [0, 5, 2, 3, 4].map((k) => buf(build(k)));
    const seeds = buf(Float32Array.from({ length: N }, rnd));
    const attr = (name: string, b: WebGLBuffer, size: number) => {
      const l = gl.getAttribLocation(pr, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
    };
    attr("aS", seeds, 1);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    const [uT, uTime, uAsp, uDpr, uM, uIntro, uVel, uF, uCalm] = ["uT", "uTime", "uAsp", "uDpr", "uM", "uIntro", "uVel", "uF", "uCalm"].map(U);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.clearColor(0.006, 0.005, 0.004, 1);

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(window.innerWidth * dpr);
      cv.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
    };
    resize();
    window.addEventListener("resize", resize);

    /* Scroll stops: the scroll position at which each shape is fully formed.
       Measured from the #features and #extension sections so section heights can be anything. */
    let stops = [0, 0, 0, 0, 0];
    const measure = () => {
      const vh = window.innerHeight, y = window.scrollY;
      const feat = document.getElementById("features");
      const ext = document.getElementById("extension");
      const ft = feat ? feat.getBoundingClientRect().top + y : vh * SCENE_VH;
      const et = ext ? ext.getBoundingClientRect().top + y : ft + vh * SCENE_VH;
      const ee = ext ? et + ext.offsetHeight : et + vh * SCENE_VH;
      stops = [0, ft, et, ee, ee + vh * SCENE_VH];
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);

    const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, rx: window.innerWidth * 0.5, ry: window.innerHeight * 0.5 };
    const move = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("pointermove", move, { passive: true });

    let cur = -1, raf = 0, t0 = -1, lastY = window.scrollY, vel = 0;
    const frame = (ms: number) => {
      if (t0 < 0) t0 = ms;
      const s = window.scrollY, vh = window.innerHeight;

      let i = 0;
      while (i < 4 && s >= stops[i + 1]) i++;
      const j = Math.min(i + 1, 4);
      const a = stops[i], b = i < 4 ? stops[i + 1] : stops[4];
      // morph happens over the last 90% of a viewport before the next stop
      const m = i >= 4 ? 0 : smooth(Math.max(a, b - vh * 0.9), b, s);
      const seg = i >= 4 ? 0 : Math.min(1, Math.max(0, (s - a) / Math.max(1, b - a)));
      const f = i + seg;

      // scroll angle: core turns a little, scatter stays flat, later shapes keep their original angles
      let rot: number;
      if (i === 0) rot = 0.5 * f * (1 - m);
      else if (i === 1) rot = m;
      else rot = 0.5 * f;
      const calm = i === 0 ? m : i === 1 ? 1 - m : 0;

      if (i !== cur) {
        cur = i;
        attr("aA", shapes[i], 3);
        attr("aB", shapes[j], 3);
      }

      vel += (Math.min(1, Math.abs(s - lastY) / 60) - vel) * 0.08;
      lastY = s;
      mouse.rx += (mouse.x - mouse.rx) * 0.12;
      mouse.ry += (mouse.y - mouse.ry) * 0.12;
      if (ring.current) ring.current.style.transform = `translate(${mouse.rx - 14}px,${mouse.ry - 14}px)`;

      gl.uniform1f(uT, m);
      gl.uniform1f(uTime, reduced ? 0 : ms / 1000);
      gl.uniform1f(uAsp, cv.width / Math.max(1, cv.height));
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uIntro, reduced ? 1 : Math.min(1, (ms - t0) / 2800));
      gl.uniform1f(uVel, reduced ? 0 : vel);
      gl.uniform1f(uF, rot);
      gl.uniform1f(uCalm, calm);
      gl.uniform2f(uM, (mouse.rx / window.innerWidth) * 2 - 1, 1 - (mouse.ry / window.innerHeight) * 2);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, N);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      window.removeEventListener("pointermove", move);
      shapes.forEach((b) => gl.deleteBuffer(b));
      gl.deleteBuffer(seeds);
      gl.deleteProgram(pr);
    };
  }, []);

  return (
    <>
      <canvas ref={canvas} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-7 w-7 items-center justify-center rounded-full border border-white/40 mix-blend-difference md:flex"
      >
        <span className="h-1 w-1 rounded-full bg-white" />
      </div>
    </>
  );
}