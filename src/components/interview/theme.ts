// src/components/interview/theme.ts
// Shared design tokens for the whole mock OA flow.
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-ui",
});
export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-ui",
});

/** Put this on the root element of every page in the flow. */
export const fontVars = `${mono.variable} ${serif.variable}`;

export const fMono = "[font-family:var(--font-mono-ui),ui-monospace,monospace]";
export const fSerif = "[font-family:var(--font-serif-ui),Georgia,serif]";

export const INK = "#0f1720";
export const LIME = "#e3f78a";

/** Frosted glass, for cards sitting on the sky. */
export const glass =
  "border border-white/70 bg-white/45 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_24px_60px_-28px_rgba(30,70,120,0.4)]";

/** Denser glass, for text-heavy panels (question text, console). */
export const glassDense =
  "border border-white/80 bg-white/70 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_24px_60px_-28px_rgba(30,70,120,0.4)]";

export const skyHero = {
  background: `
    radial-gradient(ellipse 50% 32% at 8% 6%, rgba(255,255,255,0.7), transparent 70%),
    radial-gradient(ellipse 55% 38% at 92% 30%, rgba(255,255,255,0.6), transparent 70%),
    radial-gradient(ellipse 80% 30% at 50% 100%, rgba(255,255,255,0.95), transparent 70%),
    linear-gradient(180deg, #4f97d8 0%, #86b5e0 45%, #d3e4f3 100%)
  `,
};
export const skyB = {
  background: `
    radial-gradient(ellipse 50% 40% at 85% 85%, rgba(255,255,255,0.8), transparent 70%),
    radial-gradient(ellipse 45% 35% at 10% 70%, rgba(255,255,255,0.55), transparent 70%),
    radial-gradient(ellipse 60% 30% at 60% 0%, rgba(255,255,255,0.5), transparent 70%),
    linear-gradient(200deg, #6aa9e0 0%, #a3c7e8 45%, #dce9f5 100%)
  `,
};
/** Full-bleed sky for the live assessment screen. */
export const skyApp = {
  background: `
    radial-gradient(ellipse 60% 40% at 10% 0%, rgba(255,255,255,0.6), transparent 70%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(255,255,255,0.7), transparent 70%),
    linear-gradient(190deg, #6aa9e0 0%, #9cc2e7 50%, #d6e6f4 100%)
  `,
};