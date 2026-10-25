"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Language, Mode, RunResult } from "./types";

export interface MediaState {
  camera: MediaStream | null;
  mic: MediaStream | null;
  screen: MediaStream | null;
}

export interface SessionState {
  company: string | null;
  mode: Mode;
  startedAt: number | null;
  endsAt: number | null;
  pausedLeftMs: number | null;
  finishedAt: number | null;
  mcq: Record<string, number[]>;
  code: Record<string, Partial<Record<Language, string>>>;
  lang: Record<string, Language>;
  flagged: Record<string, boolean>;
  submissions: Record<string, RunResult>;
  violations: number;
}

const initial: SessionState = {
  company: null, mode: "practice", startedAt: null, endsAt: null, pausedLeftMs: null, finishedAt: null,
  mcq: {}, code: {}, lang: {}, flagged: {}, submissions: {}, violations: 0,
};

const emptyMedia: MediaState = { camera: null, mic: null, screen: null };

interface Ctx {
  state: SessionState;
  media: MediaState;
  setup: (company: string, mode: Mode) => void;
  attach: (kind: keyof MediaState, stream: MediaStream | null) => void;
  start: (durationMins: number) => void;
  pause: () => void;
  resume: () => void;
  finish: () => void;
  setMcq: (id: string, selected: number[]) => void;
  setCode: (id: string, lang: Language, code: string) => void;
  setLang: (id: string, lang: Language) => void;
  toggleFlag: (id: string) => void;
  setSubmission: (id: string, r: RunResult) => void;
  addViolation: () => void;
}

const InterviewContext = createContext<Ctx | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initial);
  const [media, setMedia] = useState<MediaState>(emptyMedia);

  const setup = useCallback((company: string, mode: Mode) => setState({ ...initial, company, mode }), []);

  const attach = useCallback((kind: keyof MediaState, stream: MediaStream | null) => {
    setMedia((m) => {
      m[kind]?.getTracks().forEach((t) => t.stop());
      return { ...m, [kind]: stream };
    });
  }, []);

  const start = useCallback((mins: number) => {
    const now = Date.now();
    setState((s) => ({ ...s, startedAt: now, endsAt: now + mins * 60_000, pausedLeftMs: null }));
  }, []);

  const pause = useCallback(() => {
    setState((s) => (s.endsAt && s.pausedLeftMs == null ? { ...s, pausedLeftMs: Math.max(0, s.endsAt - Date.now()) } : s));
  }, []);

  const resume = useCallback(() => {
    setState((s) => (s.pausedLeftMs != null ? { ...s, endsAt: Date.now() + s.pausedLeftMs, pausedLeftMs: null } : s));
  }, []);

  const finish = useCallback(() => {
    setState((s) => (s.finishedAt ? s : { ...s, finishedAt: Date.now() }));
    setMedia((m) => {
      Object.values(m).forEach((st) => {
  st?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
});
      return emptyMedia;
    });
  }, []);

  const setMcq = useCallback((id: string, selected: number[]) => setState((s) => ({ ...s, mcq: { ...s.mcq, [id]: selected } })), []);
  const setCode = useCallback(
    (id: string, lang: Language, code: string) => setState((s) => ({ ...s, code: { ...s.code, [id]: { ...s.code[id], [lang]: code } } })),
    [],
  );
  const setLang = useCallback((id: string, lang: Language) => setState((s) => ({ ...s, lang: { ...s.lang, [id]: lang } })), []);
  const toggleFlag = useCallback((id: string) => setState((s) => ({ ...s, flagged: { ...s.flagged, [id]: !s.flagged[id] } })), []);
  const setSubmission = useCallback((id: string, r: RunResult) => setState((s) => ({ ...s, submissions: { ...s.submissions, [id]: r } })), []);
  const addViolation = useCallback(() => setState((s) => ({ ...s, violations: s.violations + 1 })), []);

  const value = useMemo(
    () => ({ state, media, setup, attach, start, pause, resume, finish, setMcq, setCode, setLang, toggleFlag, setSubmission, addViolation }),
    [state, media, setup, attach, start, pause, resume, finish, setMcq, setCode, setLang, toggleFlag, setSubmission, addViolation],
  );

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

export function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error("useInterview must be used inside <InterviewProvider>");
  return ctx;
}