import { ShieldAlert } from "lucide-react";

interface Props {
  reason: string;
  violations: number;
  max: number;
  onResume: () => void;
}

export default function ProctorOverlay({ reason, violations, max, onResume }: Props) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-zinc-950/95 p-6 backdrop-blur">
      <div className="max-w-md rounded-3xl border border-red-500/30 bg-zinc-900 p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-500/10 text-red-500"><ShieldAlert size={32} /></div>
        <h2 className="mt-6 text-2xl font-bold">Assessment paused</h2>
        <p className="mt-3 text-zinc-400">{reason}</p>
        {violations > 0 && (
          <p className="mt-4 text-sm font-semibold text-red-400">
            Violation {Math.min(violations, max)} of {max}. Your test is auto-submitted at {max}.
          </p>
        )}
        <button onClick={onResume} className="mt-8 h-12 w-full rounded-2xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600">
          Return to fullscreen &amp; continue
        </button>
      </div>
    </div>
  );
}