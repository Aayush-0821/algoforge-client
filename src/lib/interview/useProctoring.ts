"use client";

import { useCallback, useEffect, useState } from "react";
import { useInterview } from "./store";

export const MAX_VIOLATIONS = 3;

export function useProctoring(enabled: boolean) {
  const { state, addViolation } = useInterview();
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!document.fullscreenElement) setWarning("Fullscreen mode is required for this assessment.");

    const flag = (reason: string) => {
      addViolation();
      setWarning(reason);
    };
    const onFullscreen = () => {
      if (!document.fullscreenElement) flag("You exited fullscreen mode.");
    };
    const onVisibility = () => {
      if (document.hidden) flag("You switched tabs or minimised the window.");
    };
    const onContext = (e: Event) => e.preventDefault();

    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("contextmenu", onContext);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("contextmenu", onContext);
    };
  }, [enabled, addViolation]);

  const resume = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {}
    setWarning(null);
  }, []);

  return { warning, resume, violations: state.violations };
}