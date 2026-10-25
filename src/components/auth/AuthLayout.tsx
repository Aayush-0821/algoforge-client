"use client";

import { ReactNode } from "react";
import AuthContainer from "./AuthContainer";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-[#07070a]
        [color-scheme:dark]
      "
    >
      {/* Aurora background */}
      <div className="pointer-events-none absolute -left-32 -top-40 h-[560px] w-[560px] rounded-full bg-[#FF9324]/25 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-52 -right-32 h-[640px] w-[640px] rounded-full bg-[#6d4cff]/25 blur-[170px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rotate-[-18deg] rounded-full bg-[#FF9324]/10 blur-[140px]" />

      {/* Soft diagonal light streaks */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-60
          [background-image:repeating-linear-gradient(115deg,rgba(255,255,255,0.035)_0px,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_26px)]
        "
      />

      {/* Subtle grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.05]
          [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)]
          [background-size:42px_42px]
        "
      />

      <AuthContainer>{children}</AuthContainer>
    </main>
  );
}
