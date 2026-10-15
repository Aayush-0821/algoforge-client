"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Globe, Laptop, Maximize, Mic, MonitorUp } from "lucide-react";
import { getCompany } from "@/src/lib/interview/data";
import { useInterview } from "@/src/lib/interview/store";
import DeviceCheckCard, {
  type CheckStatus,
} from "@/src/components/interview/DeviceCheckCard";
import {
  INK,
  fMono,
  fSerif,
  fontVars,
  glass,
  skyB,
  skyHero,
} from "@/src/components/interview/theme";

interface Check {
  s: CheckStatus;
  msg?: string;
}

export default function SystemCheckPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company: slug } = use(params);
  const company = getCompany(slug);
  const router = useRouter();
  const { state, media, attach, start } = useInterview();

  const required = state.mode === "interview";
  const [browser, setBrowser] = useState<Check>({ s: "checking" });
  const [network, setNetwork] = useState<Check>({ s: "checking" });
  const [cam, setCam] = useState<Check>({ s: "idle" });
  const [mic, setMic] = useState<Check>({ s: "idle" });
  const [scr, setScr] = useState<Check>({ s: "idle" });
  const [level, setLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!company || state.company !== slug) router.replace(`/interview/${slug}`);
  }, [company, state.company, slug, router]);

  useEffect(() => {
    const ok = !!navigator.mediaDevices && !!document.documentElement.requestFullscreen;
    setBrowser(
      ok ? { s: "ok" } : { s: "error", msg: "Use a recent version of Chrome, Edge or Firefox." }
    );
    const upd = () =>
      setNetwork(navigator.onLine ? { s: "ok" } : { s: "error", msg: "You appear to be offline." });
    upd();
    window.addEventListener("online", upd);
    window.addEventListener("offline", upd);
    return () => {
      window.removeEventListener("online", upd);
      window.removeEventListener("offline", upd);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = media.camera;
  }, [media.camera]);

  useEffect(() => {
    if (!media.mic) return;
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    ctx.createMediaStreamSource(media.mic).connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;
    const loop = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      setLevel(Math.min(100, avg * 2.5));
      if (avg > 6) setMic({ s: "ok" });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      ctx.close();
    };
  }, [media.mic]);

  if (!company) return null;

  const testCamera = async () => {
    setCam({ s: "checking" });
    try {
      attach("camera", await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } }));
      setCam({ s: "ok" });
    } catch {
      setCam({ s: "error", msg: "Camera blocked. Allow access from the address bar and retry." });
    }
  };

  const testMic = async () => {
    setMic({ s: "checking", msg: "Say something — the meter should move." });
    try {
      attach("mic", await navigator.mediaDevices.getUserMedia({ audio: true }));
    } catch {
      setMic({ s: "error", msg: "Microphone blocked. Allow access and retry." });
    }
  };

  const testScreen = async () => {
    setScr({ s: "checking" });
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const surface = (track.getSettings() as MediaTrackSettings & { displaySurface?: string }).displaySurface;
      if (required && surface && surface !== "monitor") {
        stream.getTracks().forEach((t) => t.stop());
        setScr({ s: "error", msg: "Please share your ENTIRE screen, not a window or a tab." });
        return;
      }
      track.onended = () => setScr({ s: "error", msg: "Screen sharing stopped. Share again to continue." });
      attach("screen", stream);
      setScr({ s: "ok" });
    } catch {
      setScr({ s: "error", msg: "Screen share was cancelled." });
    }
  };

  const base = browser.s === "ok" && network.s === "ok";
  const devices = cam.s === "ok" && mic.s === "ok" && scr.s === "ok";
  const canStart = base && (!required || devices);

  const begin = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {}
    start(company.durationMins);
    router.push(`/interview/${slug}/assessment`);
  };

  return (
    <div
      className={`${fontVars} min-h-screen bg-white px-3 py-3 sm:px-6 sm:py-6`}
      style={{ color: INK }}
    >
      {/* header panel */}
      <section
        className="overflow-hidden rounded-[28px] px-5 py-10 sm:px-8 md:rounded-[44px] md:px-12 md:py-14"
        style={skyHero}
      >
        <div className="mx-auto max-w-6xl">
          <p className={`text-xs text-slate-800 ${fMono}`}>
            {company.name} | {state.mode} mode
          </p>
          <h1
            className={`mt-4 text-[52px] leading-[1] tracking-[-0.015em] md:text-[84px] ${fSerif}`}
          >
            System <em>check</em>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-slate-800">
            {required
              ? "All checks below are required before the assessment can begin."
              : "Device checks are optional in practice mode, but recommended."}
          </p>
        </div>
      </section>

      {/* checks panel */}
      <section
        className="mt-4 overflow-hidden rounded-[28px] px-5 py-10 sm:px-8 md:rounded-[44px] md:px-12 md:py-14"
        style={skyB}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-2">
            <DeviceCheckCard icon={Laptop} title="Browser" description="Fullscreen and media APIs supported." status={browser.s} message={browser.msg} />
            <DeviceCheckCard icon={Globe} title="Internet" description="Stable connection required." status={network.s} message={network.msg} />

            <DeviceCheckCard
              icon={Camera}
              title="Camera test"
              description="Make sure your face is clearly visible."
              status={cam.s}
              message={cam.msg}
              actionLabel={cam.s === "ok" ? "Retest" : "Test camera"}
              onAction={testCamera}
              optional={!required}
            >
              {media.camera && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="mt-4 aspect-video w-full rounded-2xl bg-black object-cover [transform:scaleX(-1)]"
                />
              )}
            </DeviceCheckCard>

            <DeviceCheckCard
              icon={Mic}
              title="Microphone test"
              description="Speak to see the level meter respond."
              status={mic.s}
              message={mic.msg}
              actionLabel={mic.s === "ok" ? "Retest" : "Test microphone"}
              onAction={testMic}
              optional={!required}
            >
              {media.mic && (
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-900/10">
                  <div
                    className="h-full rounded-full bg-[#8ccf00] transition-[width] duration-75"
                    style={{ width: `${level}%` }}
                  />
                </div>
              )}
            </DeviceCheckCard>

            <div className="md:col-span-2">
              <DeviceCheckCard
                icon={MonitorUp}
                title="Screen share"
                description="Share your entire screen. It stays active throughout the assessment."
                status={scr.s}
                message={scr.msg}
                actionLabel={scr.s === "ok" ? "Share again" : "Share screen"}
                onAction={testScreen}
                optional={!required}
              />
            </div>
          </div>

          {/* start bar */}
          <div
            className={`mt-6 flex flex-col items-start justify-between gap-5 rounded-[30px] p-7 md:flex-row md:items-center ${glass}`}
          >
            <div>
              <h2 className={`text-[30px] leading-none ${fSerif}`}>Ready to begin?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                The assessment opens in fullscreen and the {company.durationMins} minute timer starts immediately.
              </p>
            </div>
            <button
              disabled={!canStart}
              onClick={begin}
              className="flex h-14 shrink-0 items-center gap-3 rounded-full px-8 text-[15px] font-medium text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: INK }}
            >
              <Maximize size={18} /> Enter fullscreen &amp; start
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}