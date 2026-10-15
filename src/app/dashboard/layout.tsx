import type { ReactNode } from "react";

import { Sidebar, Topbar } from "@/src/components/dashboard/layout";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#ECE9E6] text-zinc-900 dark:bg-[#09090B] dark:text-white">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[180px]" />
        <div className="absolute bottom-0 left-0 h-[380px] w-[380px] rounded-full bg-orange-300/20 blur-[160px] dark:bg-orange-500/5" />
      </div>

      <Topbar />

      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain no-scrollbar pb-6 pl-2 pr-6">
          {children}
        </main>
      </div>
    </div>
  );
}