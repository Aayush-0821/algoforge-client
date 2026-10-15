"use client";

// NOTE: I couldn't see your original DeviceCheckCard, so this is rebuilt from
// how the system-check page calls it. Props are the same; diff before replacing.
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, X } from "lucide-react";
import { INK, LIME, fMono, fSerif, glass } from "./theme";

export type CheckStatus = "idle" | "checking" | "ok" | "error";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  status: CheckStatus;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  optional?: boolean;
  children?: ReactNode;
}

export default function DeviceCheckCard({
  icon: Icon,
  title,
  description,
  status,
  message,
  actionLabel,
  onAction,
  optional,
  children,
}: Props) {
  return (
    <div className={`flex h-full flex-col rounded-[28px] p-6 ${glass}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80">
          <Icon size={20} className="text-slate-800" />
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1 text-[11px] ${fMono} ${
            status === "error"
              ? "bg-red-500/15 text-red-700"
              : status === "checking"
                ? "bg-amber-400/30 text-amber-800"
                : status === "idle"
                  ? "bg-white/60 text-slate-600"
                  : ""
          }`}
          style={status === "ok" ? { backgroundColor: LIME } : undefined}
        >
          {status === "ok" && <Check size={12} strokeWidth={3} />}
          {status === "error" && <X size={12} strokeWidth={3} />}
          {status === "checking" && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-600" />
          )}
          {status === "ok"
            ? "Ready"
            : status === "error"
              ? "Needs attention"
              : status === "checking"
                ? "Checking"
                : optional
                  ? "Optional"
                  : "Not tested"}
        </span>
      </div>

      <h3 className={`mt-5 text-[28px] leading-none ${fSerif}`}>{title}</h3>
      <p className="mt-2 text-[13px] leading-6 text-slate-700">{description}</p>

      {message && (
        <p
          className={`mt-3 text-[13px] leading-6 ${
            status === "error" ? "text-red-700" : "text-slate-700"
          }`}
        >
          {message}
        </p>
      )}

      {children}

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          disabled={status === "checking"}
          className="mt-auto self-start rounded-full px-5 py-2.5 text-[13px] font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50"
          style={{ backgroundColor: INK, marginTop: children || message ? 20 : 24 }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}