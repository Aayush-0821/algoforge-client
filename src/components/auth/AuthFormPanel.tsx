"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, UserPlus } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useEffect, useState } from "react";

import {
  login,
  register,
  getGoogleAuthUrl,
  getGitHubAuthUrl,
} from "@/src/lib/api/auth";

import { getProfile } from "@/src/lib/api/profile";

interface Props {
  mode: "login" | "signup";
}

export default function AuthFormPanel({ mode }: Props) {
  const isLogin = mode === "login";

  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // OAuth error handler
  useEffect(() => {
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError(oauthError);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);

        console.log("Login successful:", result);

        if(!result.user?.onboardingCompleted){
          router.push("/onboarding");
        }
        else {
          router.push("/dashboard");
        }

      } else {
        await register(email, password);

        setSuccess(
          "Account created! Please verify your email before signing in.",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass = `
    h-11 w-full rounded-xl border border-white/10
    bg-white/[0.03] px-4 text-sm text-white
    placeholder:text-zinc-500 outline-none transition
    focus:border-[#FF9324]/70 focus:bg-white/[0.05]
    focus:ring-4 focus:ring-[#FF9324]/10
  `;

  const oauthClass = `
    flex h-11 items-center justify-center gap-2
    rounded-xl border border-white/10 bg-white/[0.03]
    text-sm font-medium text-white transition-all
    hover:border-[#FF9324]/60 hover:bg-white/[0.06]
  `;

  return (
    <div className="w-full max-w-[390px]">
      <div className="flex flex-col items-center text-center">
        

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>

        <p className="mt-2 text-sm text-zinc-400">
          {isLogin
            ? "Sign in to continue to AlgoForge."
            : "Start your AI-powered coding journey."}
        </p>
      </div>

      {/* OAuth */}

      <div className="mt-7 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            window.location.href = getGoogleAuthUrl(mode);
          }}
          className={oauthClass}
        >
          <FaGoogle className="text-red-500" />
          Google
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = getGitHubAuthUrl(mode);
          }}
          className={oauthClass}
        >
          <FaGithub />
          GitHub
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />

        <span className="text-xs uppercase tracking-widest text-zinc-500">
          OR
        </span>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-3">
          {!isLogin && (
            <input placeholder="Full Name" className={inputClass} />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputClass} pr-11`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute right-3 top-1/2
                -translate-y-1/2
                text-zinc-500
                transition-colors
                hover:text-[#FF9324]
              "
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {isLogin && (
          <div className="mt-3 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-zinc-400 transition-colors hover:text-[#FF9324]"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl border border-green-900/50 bg-green-950/30 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="
            mt-5 h-11 w-full rounded-xl
            bg-[#FF9324]
            text-sm font-semibold text-black
            shadow-[0_8px_24px_rgba(255,147,36,0.25)]
            transition-all
            hover:bg-[#ffa142]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? isLogin
              ? "Signing in..."
              : "Creating account..."
            : isLogin
              ? "Sign In"
              : "Continue"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-400">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#FF9324] hover:underline"
            >
              Create one
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#FF9324] hover:underline"
            >
              Sign In
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
