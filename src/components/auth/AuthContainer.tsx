"use client";

import { ReactNode } from "react";
import { Braces } from "lucide-react";
import AuthPreview from "./AuthPreview";

interface Props {
  children: ReactNode;
}

export default function AuthContainer({ children }: Props) {
  return (
    <div
      className="
        relative
        z-10
        w-[92vw]
        max-w-[1320px]
        rounded-[36px]
        border
        border-white/10
        bg-white/[0.05]
        p-3
        shadow-[0_40px_120px_rgba(0,0,0,.6)]
        backdrop-blur-2xl
      "
    >
      <section
        className="
          relative
          flex
          h-[84vh]
          max-h-[740px]
          min-h-[620px]
          w-full
          overflow-hidden
          rounded-[26px]
          border
          border-white/[0.06]
          bg-[#0b0b0e]
        "
      >
        {/* Left Panel */}

        <div className="relative flex w-full flex-col lg:w-[45%]">
          {/* Logo */}
          <div className="absolute left-8 top-8 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <Braces size={18} className="text-[#FF9324]" />
            </div>

            <span className="text-sm font-semibold tracking-tight text-white">
              AlgoForge
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-y-auto px-8 py-14 [scrollbar-width:none] lg:px-10 xl:px-14 [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        </div>

        {/* Right Preview */}

        <div className="relative hidden w-[55%] p-3 pl-0 lg:block">
          <AuthPreview />
        </div>
      </section>
    </div>
  );
}
