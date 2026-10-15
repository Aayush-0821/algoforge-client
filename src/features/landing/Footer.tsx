"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pixelify_Sans } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

import { navLinks } from "./navbar/nav-links";

const pixel = Pixelify_Sans({ subsets: ["latin"], weight: ["400", "500"] });

const CW = 11; // cell width
const CH = 15; // cell height

/* ASCII texture: a slow noise field of - = + * with orange "sparks" that rain down and flare under the cursor. */
function AsciiField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, cols = 0, rows = 0, raf = 0, last = 0, visible = true;
    let drops: { y: number; v: number; wait: number }[] = [];
    const mouse = { x: -9999, y: -9999 };
    const TRAIL = 9;

    const build = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      if (!w || !h) return;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CH - 3}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";
      cols = Math.ceil(w / CW);
      rows = Math.ceil(h / CH);
      drops = Array.from({ length: cols }, () => ({
        y: -Math.random() * rows * 2,
        v: 0.08 + Math.random() * 0.25,
        wait: 0,
      }));
    };

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || !w || time - last < 40) return; // ~25fps
      last = time;
      const t = time / 1000;
      const cr = cv.getBoundingClientRect();
      const mx = mouse.x - cr.left, my = mouse.y - cr.top;

      ctx.clearRect(0, 0, w, h);
      for (let c = 0; c < cols; c++) {
        const d = drops[c];
        if (!reduce) {
          if (d.wait > 0) d.wait--;
          else {
            d.y += d.v;
            if (d.y - TRAIL > rows) {
              d.y = -Math.random() * 12;
              d.v = 0.08 + Math.random() * 0.25;
              d.wait = Math.floor(Math.random() * 120);
            }
          }
        }
        for (let r = 0; r < rows; r++) {
          const n =
            (Math.sin(c * 0.09 + t * 0.4) + Math.sin(r * 0.13 - t * 0.3) + Math.sin((c + r) * 0.05 + t * 0.2) + 3) / 6;
          const dr = d.y - r;
          const rain = dr >= 0 && dr < TRAIL ? 1 - dr / TRAIL : 0;
          const x = c * CW, y = r * CH;
          const md = Math.hypot(x - mx, y - my);
          const near = md < 160 ? 1 - md / 160 : 0;
          const v = n * 0.55 + rain * 0.7 + near * 0.8;
          if (v < 0.28) continue;

          const ch = v < 0.42 ? "-" : v < 0.58 ? "=" : v < 0.78 ? "+" : "*";
          const a = Math.min(0.55, 0.06 + v * 0.3);
          ctx.fillStyle = rain > 0.2 || near > 0.25 ? `rgba(249,115,22,${Math.min(0.9, a * 1.8)})` : `rgba(255,255,255,${a * 0.45})`;
          ctx.fillText(ch, x, y);
        }
      }
      if (reduce) cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    const ro = new ResizeObserver(build);

    build();
    io.observe(cv);
    ro.observe(cv);
    addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}

const LINK = "block py-1 text-neutral-300 transition-colors hover:text-orange-400";

export default function Footer() {
  return (
    <footer className={`${pixel.className} relative overflow-hidden bg-[#060504] text-white`}>
      <AsciiField />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#060504] via-transparent to-[#060504]/70" />

      <div className="relative mx-auto flex min-h-[760px] max-w-[1400px] flex-col justify-end px-6 md:px-10">
        <div className="pb-14 pt-40">
          <p className="text-sm uppercase tracking-[0.12em] text-neutral-400">Solve smarter / Crack the interview</p>
          <h2 className="mt-5 text-[clamp(3rem,9vw,8.5rem)] uppercase leading-[0.95] tracking-tight">
            <span className="block">Think. Solve.</span>
            <span className="block bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Forge.
            </span>
          </h2>
          <Link
            href="#extension"
            className="group mt-9 inline-flex items-center gap-10 border border-white/70 bg-[#060504]/60 px-4 py-3 text-sm uppercase tracking-wide backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
          >
            Add to Chrome - Free
            <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-8 border-t border-white/20 py-6 text-xs uppercase tracking-wide md:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <p className="flex items-center gap-2 text-sm">
              <Image src="/logo.svg" alt="" width={18} height={18} className="rounded-sm" />
              AlgoForge
            </p>
            <p className="mt-3 text-neutral-500">(c) 2026 AlgoForge</p>
          </div>

          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={LINK}>
                  {l.title}
                </a>
              </li>
            ))}
          </ul>

          <ul>
            <li>
              <Link href="/login" className={LINK}>
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className={LINK}>
                Sign up
              </Link>
            </li>
          </ul>

          <div className="text-neutral-500 md:text-right">
        
            <p className="mt-1">Built with ❤️ By Forgey</p>
            <p className="mt-1"></p>
          
          </div>
        </div>
      </div>
    </footer>
  );
}