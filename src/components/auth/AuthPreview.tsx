"use client";

import { motion } from "framer-motion";
import { Flame, ShieldCheck, Target, TrendingUp } from "lucide-react";

export default function AuthPreview() {
  return (
    <div
      className="
        relative
        h-full
        w-full
        overflow-hidden
        rounded-[22px]
        border
        border-white/10
        bg-[#0f0d14]
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_0%,rgba(109,76,255,0.35),transparent_55%),radial-gradient(90%_70%_at_20%_100%,rgba(255,147,36,0.30),transparent_60%)]" />

      <div
        className="
          absolute
          inset-0
          opacity-70
          [background-image:repeating-linear-gradient(115deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_22px)]
        "
      />

      {/* Glow behind mascot */}
      <div className="absolute left-1/2 top-[52%] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFD84A]/20 blur-[90px]" />

      {/* Bottom fade for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* =====================================================
          MASCOT GIF
      ====================================================== */}

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-[20%] top-[26%] z-10 flex items-center justify-center"
      >
        <img
          src="/pikachu-happy.gif"
          alt="Happy Pikachu"
          draggable={false}
          className="
            h-full
            max-h-[360px]
            w-auto
            select-none
            object-contain
            drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]
          "
        />
      </motion.div>

     
      {/* =====================================================
          WEEKLY PROGRESS
      ====================================================== */}

      <GlassCard className="left-7 top-[9.5%] w-[220px]" delay={0}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium text-white/60">
              Weekly progress
            </p>

            <p className="mt-1 text-2xl font-bold text-white">78%</p>
          </div>

          <TrendingUp size={14} className="text-[#FF9324]" />
        </div>

        <div className="mt-4 flex h-10 items-end gap-1.5">
          {[25, 35, 42, 30, 58, 72, 85].map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.45 }}
              className="flex-1 rounded-t bg-[#FF9324]"
            />
          ))}
        </div>
      </GlassCard>

      {/* =====================================================
          NEXT TO SOLVE
      ====================================================== */}

      <GlassCard className="right-7 top-[27%] w-[210px]" delay={0.2}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90">
            <Target size={16} className="text-zinc-900" />
          </div>

          <div>
            <p className="text-[10px] text-white/60">Next to solve</p>

            <p className="text-sm font-semibold text-white">Binary Search</p>
          </div>

          <span className="ml-auto rounded-full bg-[#FF9324]/20 px-2.5 py-1 text-[10px] font-semibold text-[#FFB05A]">
            Medium
          </span>
        </div>
      </GlassCard>

      {/* =====================================================
          STREAK
      ====================================================== */}

      <GlassCard className="bottom-[27%] right-7 w-[170px]" delay={0.4}>
        <div className="flex items-center gap-2.5">
          <Flame size={18} className="text-[#FF9324]" />

          <div>
            <p className="text-[10px] text-white/60">Current streak</p>

            <p className="text-sm font-bold text-white">12 days</p>
          </div>
        </div>
      </GlassCard>

      {/* =====================================================
          CAPTION
      ====================================================== */}

      <div className="absolute bottom-8 left-8 right-8 z-30">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Crack the interview.
        </h2>

        <p className="mt-1.5 max-w-sm text-sm text-white/70">
          Practice with AI, track your progress and level up every day.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   GLASS CARD
========================================================= */

function GlassCard({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: {
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      className={`
        absolute
        z-20
        rounded-2xl
        border
        border-white/15
        bg-white/10
        p-4
        shadow-[0_18px_40px_rgba(0,0,0,0.35)]
        backdrop-blur-xl
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
