"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Bell, Flame, Moon, Search, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { getProfile, type ProfileResponse } from "@/src/lib/api/profile";

const circleBtn =
  "flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-zinc-700 shadow-sm transition hover:bg-white dark:bg-white/5 dark:text-white dark:shadow-none dark:hover:bg-white/10";

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function loadProfile() {
      try {
        setProfile(await getProfile());
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }

    loadProfile();
  }, []);

  const displayName = profile?.profile.displayName || "User";

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isDark = mounted && theme === "dark";

  return (
    <header className="grid h-20 shrink-0 grid-cols-[1fr_minmax(0,32rem)_1fr] items-center gap-6 px-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-base font-bold text-white shadow-lg shadow-orange-500/30">
          AF
        </div>

        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-zinc-900 dark:text-white">Algo</span>
          <span className="text-orange-500">Forge</span>
        </h1>
      </Link>

            {/* Search */}
      <div className="relative w-full">
        <Search
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          placeholder="Search problems, reports..."
          className="h-12 w-full rounded-full bg-white/70 pl-12 pr-20 text-sm text-zinc-900 shadow-sm outline-none ring-1 ring-transparent transition-all duration-300 placeholder:text-zinc-500 focus:bg-white focus:ring-orange-500/40 dark:bg-white/5 dark:text-white dark:shadow-none dark:focus:bg-white/[0.07]"
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-black/5 px-2 py-1 text-xs text-zinc-500 dark:bg-white/5">
          Ctrl K
        </div>
      </div>

            {/* Right actions */}
      <div className="flex items-center justify-end gap-3">
        {/* Theme segmented toggle */}
        <div className="flex items-center gap-1 rounded-full bg-white/70 p-1 shadow-sm dark:bg-white/5 dark:shadow-none">
          <button
            onClick={() => setTheme("dark")}
            aria-label="Dark theme"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
              isDark
                ? "bg-white text-zinc-900 shadow dark:bg-white/10 dark:text-white"
                : "text-zinc-400",
            )}
          >
            <Moon size={16} />
          </button>

          <button
            onClick={() => setTheme("light")}
            aria-label="Light theme"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
              mounted && !isDark
                ? "bg-white text-zinc-900 shadow"
                : "text-zinc-400",
            )}
          >
            <Sun size={16} />
          </button>
        </div>

        

        <button aria-label="Notifications" className={circleBtn}>
          <Bell size={18} />
        </button>

        <Link
          href="/profile"
          aria-label="Profile"
          className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-white/70 transition hover:ring-orange-500/50 dark:ring-white/10"
        >
          {profile?.profile.avatarUrl ? (
            <img
              src={profile.profile.avatarUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-semibold text-white">
              {initials}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}