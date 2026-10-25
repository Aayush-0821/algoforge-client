
"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  getCompanyAssessments,
  type CompanyAssessment,
} from "@/src/lib/mockoa/api";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessmentId");

  const companyMeta = getCompany(slug);
  const { state, media, attach, start } = useInterview();

  const [assessment, setAssessment] = useState<CompanyAssessment | null>(null);
  const [assessmentLoading, setAssessmentLoading] = useState(true);
  const [assessmentError, setAssessmentError] = useState("");

  const required = state.mode === "interview";
  const [browser, setBrowser] = useState<Check>({ s: "checking" });
  const [network, setNetwork] = useState<Check>({ s: "checking" });
  const [cam, setCam] = useState<Check>({ s: "idle" });
  const [mic, setMic] = useState<Check>({ s: "idle" });
  const [scr, setScr] = useState<Check>({ s: "idle" });
  const [level, setLevel] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let active = true;

    async function loadAssessment() {
      setAssessmentLoading(true);
      setAssessmentError("");

      if (!assessmentId) {
        setAssessmentError(
          "No assessment was selected. Return to the company page and choose an OA.",
        );
        setAssessmentLoading(false);
        return;
      }

      try {
        const result = await getCompanyAssessments(slug);
        const selected = result.assessments.find(
          (item) => item.id === assessmentId,
        );

        if (!selected) {
          throw new Error(
            "This assessment is unavailable or is no longer published.",
          );
        }

        if (active) setAssessment(selected);
      } catch (error) {
        if (active) {
          setAssessmentError(
            error instanceof Error
              ? error.message
              : "Unable to load the selected assessment.",
          );
        }
      } finally {
        if (active) setAssessmentLoading(false);
      }
    }

    void loadAssessment();

    return () => {
      active = false;
    };
  }, [slug, assessmentId]);

  useEffect(() => {
    if (state.company !== slug) {
      router.replace(`/interview/${slug}`);
    }
  }, [state.company, slug, router]);

  useEffect(() => {
    const ok =
      !!navigator.mediaDevices &&
      !!document.documentElement.requestFullscreen;

    setBrowser(
      ok
        ? { s: "ok" }
        : {
            s: "error",
            msg: "Use a recent version of Chrome, Edge or Firefox.",
          },
    );

    const updateNetwork = () =>
      setNetwork(
        navigator.onLine
          ? { s: "ok" }
          : { s: "error", msg: "You appear to be offline." },
      );

    updateNetwork();
    window.addEventListener("online", updateNetwork);
    window.addEventListener("offline", updateNetwork);

    return () => {
      window.removeEventListener("online", updateNetwork);
      window.removeEventListener("offline", updateNetwork);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = media.camera;
    }
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
      void ctx.close();
    };
  }, [media.mic]);

  const testCamera = async () => {
    setCam({ s: "checking" });

    try {
      attach(
        "camera",
        await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        }),
      );
      setCam({ s: "ok" });
    } catch {
      setCam({
        s: "error",
        msg: "Camera blocked. Allow access from the address bar and retry.",
      });
    }
  };

  const testMic = async () => {
    setMic({ s: "checking", msg: "Say something — the meter should move." });

    try {
      attach("mic", await navigator.mediaDevices.getUserMedia({ audio: true }));
    } catch {
      setMic({
        s: "error",
        msg: "Microphone blocked. Allow access and retry.",
      });
    }
  };

  const testScreen = async () => {
    setScr({ s: "checking" });

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const track = stream.getVideoTracks()[0];
      const surface = (
        track.getSettings() as MediaTrackSettings & {
          displaySurface?: string;
        }
      ).displaySurface;

      if (required && surface && surface !== "monitor") {
        stream.getTracks().forEach((item) => item.stop());
        setScr({
          s: "error",
          msg: "Please share your ENTIRE screen, not a window or a tab.",
        });
        return;
      }

      track.onended = () =>
        setScr({
          s: "error",
          msg: "Screen sharing stopped. Share again to continue.",
        });

      attach("screen", stream);
      setScr({ s: "ok" });
    } catch {
      setScr({ s: "error", msg: "Screen share was cancelled." });
    }
  };

  const base = browser.s === "ok" && network.s === "ok";
  const devices = cam.s === "ok" && mic.s === "ok" && scr.s === "ok";
  const canStart =
    base &&
    (!required || devices) &&
    !!assessment &&
    !assessmentLoading &&
    !assessmentError;

  const begin = async () => {
    if (!assessment || !assessmentId || !canStart) return;

    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // The browser may deny fullscreen; the checks below still govern access.
    }

    start(assessment.durationMinutes);

    router.push(
      `/interview/${slug}/assessment?assessmentId=${encodeURIComponent(
        assessmentId,
      )}`,
    );
  };

  const companyName =
    companyMeta?.name ??
    slug.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div
      className={`${fontVars} min-h-screen bg-white px-3 py-3 sm:px-6 sm:py-6`}
      style={{ color: INK }}
    >
      <section
        className="overflow-hidden rounded-[28px] px-5 py-10 sm:px-8 md:rounded-[44px] md:px-12 md:py-14"
        style={skyHero}
      >
        <div className="mx-auto max-w-6xl">
          <p className={`text-xs text-slate-800 ${fMono}`}>
            {companyName} | {state.mode} mode
          </p>

          <h1
            className={`mt-4 text-[52px] leading-[1] tracking-[-0.015em] md:text-[84px] ${fSerif}`}
          >
            System <em>check</em>
          </h1>

          {assessmentLoading ? (
            <p className="mt-5 text-sm text-slate-700">
              Loading your selected assessment…
            </p>
          ) : assessmentError ? (
            <div role="alert" className="mt-5 max-w-2xl">
              <p className="text-sm leading-6 text-red-800">
                {assessmentError}
              </p>
              <button
                type="button"
                onClick={() => router.replace(`/interview/${slug}`)}
                className="mt-3 text-sm font-semibold underline"
              >
                Choose an assessment
              </button>
            </div>
          ) : assessment ? (
            <>
              <p className={`mt-5 text-xs text-slate-700 ${fMono}`}>
                SELECTED OA
              </p>
              <h2 className={`mt-1 text-3xl ${fSerif}`}>
                {assessment.title}
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-slate-800">
                {required
                  ? "All checks below are required before the assessment can begin."
                  : "Device checks are optional in practice mode, but recommended."}
              </p>
            </>
          ) : null}
        </div>
      </section>

      <section
        className="mt-4 overflow-hidden rounded-[28px] px-5 py-10 sm:px-8 md:rounded-[44px] md:px-12 md:py-14"
        style={skyB}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 md:grid-cols-2">
            <DeviceCheckCard
              icon={Laptop}
              title="Browser"
              description="Fullscreen and media APIs supported."
              status={browser.s}
              message={browser.msg}
            />

            <DeviceCheckCard
              icon={Globe}
              title="Internet"
              description="Stable connection required."
              status={network.s}
              message={network.msg}
            />

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

          <div
            className={`mt-6 flex flex-col items-start justify-between gap-5 rounded-[30px] p-7 md:flex-row md:items-center ${glass}`}
          >
            <div>
              <h2 className={`text-[30px] leading-none ${fSerif}`}>
                Ready to begin?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {assessment
                  ? `${assessment.title} · ${assessment.durationMinutes} minutes · ${assessment.totalQuestions} questions. The timer starts when you enter.`
                  : "Your selected assessment details will appear here."}
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
