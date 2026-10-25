"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Newsreader } from "next/font/google";
import { ArrowUpRight } from "lucide-react";

const serif = Newsreader({ subsets: ["latin"], weight: ["400", "500"] });

const ease = [0.22, 1, 0.36, 1] as const;

const link = "underline decoration-neutral-900/40 underline-offset-2 transition-colors hover:text-orange-600 hover:decoration-orange-600";

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: "How is AlgoForge different from other practice platforms?",
    a: "Most platforms only track what you have solved. AlgoForge looks at how you solve: your habits, your patterns and the concepts that keep slowing you down. It turns that into a personalized roadmap, so you spend time on what actually moves your interview readiness.",
  },
  {
    q: "How does the Chrome extension work?",
    a: "Install it once and keep solving where you already do. Your submissions sync to your AlgoForge dashboard automatically and are analyzed for patterns, weak topics and next steps, with no copying and pasting.",
  },
  {
    q: "What does the AI recommend?",
    a: "It picks the next problems worth your time based on your weak concepts and recent attempts, and it updates your roadmap as you improve, so the plan never goes stale.",
  },
  {
    q: "Is AlgoForge free?",
    a: (
      <>
        You can start on the free plan and upgrade when you are ready for more. See the plans just above, or{" "}
        <Link href="/signup" className={link}>
          create an account
        </Link>{" "}
        to try it.
      </>
    ),
  },
];

let seed = 11;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const hex = (n: number) => Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]).join("");
const tokens = [
  () => "0x" + hex(12),
  () => "O(n)",
  () => "O(log n)",
  () => (rnd() * 30).toFixed(3) + " ms",
  () => "dp[" + Math.floor(rnd() * 99) + "]",
  () => "AC",
  () => "heap.pop()",
  () => "i=" + Math.floor(rnd() * 999),
  () => "mid=" + Math.floor(rnd() * 999),
  () => hex(8),
  () => "Σ " + (rnd() * 9999).toFixed(2),
  () => "→",
];
const line = () => {
  let out = "";
  while (out.length < 170) out += tokens[Math.floor(rnd() * tokens.length)]() + "  ";
  return out;
};
const LINES = Array.from({ length: 70 }, line);

function Ribbon() {
  const rows = [...LINES, ...LINES];
  return (
    <div className="relative h-80 overflow-hidden bg-[#e9e9e6] lg:h-auto">
      <div
        aria-hidden
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_75%_80%_at_58%_50%,#000_28%,transparent_82%)]"
      >
        <div className="absolute -inset-[30%] [transform:perspective(1100px)_rotateY(-28deg)_rotateZ(-14deg)]">
          <motion.div animate={{ y: ["0%", "-50%"] }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}>
            {rows.map((l, i) => (
              <div
                key={i}
                className={`whitespace-nowrap font-mono text-[9px] leading-[12px] ${
                  i % 7 === 0 ? "text-orange-600" : i % 2 ? "text-neutral-400" : "text-neutral-900"
                }`}
              >
                {l}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      
    </div>
  );
}


export default function FaqSection() {
  return (
    <section
      id="faq"
      className={`${serif.className} relative border-t border-dashed border-neutral-900/25 text-neutral-900 lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)_minmax(0,36%)]`}
    >
      <div className="flex flex-col justify-between gap-16 border-neutral-900/25 px-6 py-14 lg:border-r lg:border-dashed lg:px-8 lg:py-10">
        <span aria-hidden className="hidden lg:block" />
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease }}
          className="text-[clamp(2.4rem,3.6vw,3.4rem)] font-normal leading-[0.95] tracking-[-0.03em]"
        >
          Frequently
          <br />
          asked questions
        </motion.h2>
        <div className="text-[14px] leading-6 text-neutral-600">
          <p className="text-neutral-500">{"// Still curious?"}</p>
          <p className="mt-1">
            Mail us at <br></br>support4algoforge@gmail.com.{" "}
            
            .
          </p>
        </div>
      </div>

      <div className="border-t border-dashed border-neutral-900/25 lg:border-r lg:border-t-0">
        <ol className="flex h-full flex-col justify-center">
          {faqs.map((f, i) => (
            <motion.li
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.05, ease }}
              className="border-b border-dashed border-neutral-900/25 px-6 py-8 last:border-b-0 lg:px-10"
            >
              <h3 className="text-[18px] font-medium leading-6 tracking-[-0.01em]">
                <span className="mr-2 text-neutral-500">{String(i + 1).padStart(2, "0")} ::</span>
                {f.q}
              </h3>
              <p className="mt-3 max-w-[30rem] text-[17px] leading-[1.35] text-neutral-700 lg:ml-[2.6rem]">{f.a}</p>
            </motion.li>
          ))}
        </ol>
      </div>
      
      <Ribbon />
    </section>
  );
}
