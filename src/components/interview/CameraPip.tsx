"use client";

import { useEffect, useRef } from "react";
import { useInterview } from "@/src/lib/interview/store";

export default function CameraPip() {
  const { media } = useInterview();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = media.camera;
  }, [media.camera]);

  if (!media.camera) return null;

  return (
    <div className="pointer-events-none fixed bottom-20 right-5 z-40 w-44 overflow-hidden rounded-2xl border border-zinc-700 bg-black shadow-2xl">
      <video ref={ref} autoPlay muted playsInline className="aspect-video w-full object-cover [transform:scaleX(-1)]" />
      <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> REC
      </div>
    </div>
  );
}