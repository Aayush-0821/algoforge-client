"use client";

import { useId, useRef, useState } from "react";
import { SlidersHorizontal, ArrowUpRight } from "lucide-react";

const data = [62, 68, 64, 71, 74, 70, 78, 82, 79, 85, 88, 91];

const W = 640;
const H = 240;
const PAD = { top: 24, right: 24, bottom: 28, left: 40 };
const MIN = 50;
const MAX = 100;

const x = (i: number) =>
  PAD.left + (i * (W - PAD.left - PAD.right)) / (data.length - 1);
const y = (v: number) =>
  PAD.top + ((MAX - v) / (MAX - MIN)) * (H - PAD.top - PAD.bottom);

const points = data.map((v, i) => ({ x: x(i), y: y(v) }));

function smoothPath(pts: { x: number; y: number }[]) {
  let d = `M${pts[0].x},${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }

  return d;
}

const line = smoothPath(points);
const area = `${line} L${points[points.length - 1].x},${H - PAD.bottom} L${points[0].x},${H - PAD.bottom} Z`;

export default function AccuracyChart() {
  const gradientId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(data.length - 1);

  const handleMove = (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const vx = ((e.clientX - rect.left) / rect.width) * W;

    let nearest = 0;
    let best = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - vx);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });

    setActive(nearest);
  };

  const p = points[active];

  return (
    <section className="flex h-full min-h-[420px] flex-col rounded-[2rem] bg-white/50 p-3 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 pb-4 pt-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Accuracy
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Up 14% over the last 12 weeks
          </p>
        </div>

        <div className="flex gap-2">
          <button
            aria-label="Filters"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-zinc-700 shadow-sm transition hover:bg-white dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10"
          >
            <SlidersHorizontal size={18} />
          </button>

          <button
            aria-label="Open analytics"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-zinc-700 shadow-sm transition hover:bg-white dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10"
          >
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-center rounded-3xl bg-white p-4 dark:bg-white/[0.04]">
        <div
          ref={wrapRef}
          onMouseMove={handleMove}
          onMouseLeave={() => setActive(data.length - 1)}
          className="relative w-full"
        >
          {/* Floating bubble */}
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white shadow-lg transition-all duration-150 dark:bg-white dark:text-zinc-900"
            style={{
              left: `${(p.x / W) * 100}%`,
              top: `calc(${(p.y / H) * 100}% - 12px)`,
            }}
          >
            {data[active]}%
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid + y labels */}
            {[60, 80, 100].map((v) => (
              <g key={v}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y(v)}
                  y2={y(v)}
                  className="stroke-black/10 dark:stroke-white/10"
                  strokeDasharray="4 4"
                />
                <text
                  x={PAD.left - 10}
                  y={y(v) + 4}
                  textAnchor="end"
                  className="fill-zinc-400 text-[11px]"
                >
                  {v}
                </text>
              </g>
            ))}

            {/* X labels */}
            {points.map((pt, i) =>
              i % 2 === 0 ? (
                <text
                  key={i}
                  x={pt.x}
                  y={H - 6}
                  textAnchor="middle"
                  className="fill-zinc-400 text-[11px]"
                >
                  W{i + 1}
                </text>
              ) : null,
            )}

            {/* Area + line */}
            <path d={area} fill={`url(#${gradientId})`} />
            <path
              d={line}
              fill="none"
              stroke="#f97316"
              strokeWidth={2.5}
              strokeLinecap="round"
            />

            {/* Points */}
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={i === active ? 6 : 3.5}
                className={
                  i === active
                    ? "fill-orange-500 stroke-white dark:stroke-[#18181b]"
                    : "fill-white stroke-orange-500 dark:fill-[#18181b]"
                }
                strokeWidth={i === active ? 3 : 2}
                style={{ transition: "r 150ms" }}
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}