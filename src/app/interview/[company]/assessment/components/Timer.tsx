"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

interface TimerProps {
  initialSeconds?: number;
  onTimeUp?: () => void;
}

export default function Timer({
  initialSeconds = 100 * 60, // 100 minutes
  onTimeUp,
}: TimerProps) {
  const [secondsLeft, setSecondsLeft] =
    useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  const hours = Math.floor(secondsLeft / 3600);

  const minutes = Math.floor(
    (secondsLeft % 3600) / 60
  );

  const seconds = secondsLeft % 60;

  const pad = (num: number) =>
    num.toString().padStart(2, "0");

  const danger = secondsLeft <= 10 * 60;

  return (
    <div
      className={`
        flex
        items-center
        gap-3
        rounded-xl
        border
        px-4
        py-2
        transition-all

        ${
          danger
            ? "border-red-500/30 bg-red-500/10 text-red-500"
            : "border-orange-500/20 bg-orange-500/10 text-orange-500"
        }
      `}
    >
      <Clock3 size={18} />

      <span className="font-mono text-lg font-semibold tracking-widest">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </div>
  );
}