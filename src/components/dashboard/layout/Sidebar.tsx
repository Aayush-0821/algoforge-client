"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { navigation } from "./navigation";

function RailTooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:bg-white dark:text-zinc-900">
      {label}
    </span>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-24 shrink-0 flex-col items-center pb-6 pt-2">
      {/* Navigation */}
      <nav className="flex flex-1 flex-col items-center gap-3">
        {navigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.title}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
                active
                  ? "bg-zinc-900 text-white shadow-lg shadow-black/20 dark:bg-orange-500 dark:shadow-orange-500/30"
                  : "bg-white/70 text-zinc-500 shadow-sm hover:bg-white hover:text-zinc-900 dark:bg-white/5 dark:text-zinc-400 dark:shadow-none dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />

              {item.premium && (
                <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#ECE9E6] bg-orange-500 dark:border-[#09090B]" />
              )}

              <RailTooltip
                label={item.premium ? `${item.title} · PRO` : item.title}
              />
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Link
        href="/"
        aria-label="Log out"
        className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-zinc-500 shadow-sm transition-all duration-200 hover:bg-white hover:text-orange-500 dark:bg-white/5 dark:text-zinc-400 dark:shadow-none dark:hover:bg-white/10"
      >
        <LogOut className="h-[18px] w-[18px]" />
        <RailTooltip label="Log out" />
      </Link>
    </aside>
  );
}