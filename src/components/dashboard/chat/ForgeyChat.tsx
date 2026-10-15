"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Send, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import SvgForgey from "../../mascot/svg/ForgeySVG";

interface Message {
  id: number;
  from: "forgey" | "user";
  text: string;
}

const tabs = [
  { id: "help", icon: HelpCircle, label: "Help" },
  { id: "chat", icon: MessageCircle, label: "Chat" },
  { id: "settings", icon: Settings, label: "Settings" },
] as const;

const quickPrompts = [
  "What should I solve today?",
  "How am I improving?",
];

export default function ForgeyChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: "forgey",
      text: "Hi there! I'm Forgey. Ready to forge today's victory? Stuck on a problem? I'm here to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>(
    "chat",
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;

    // TODO: call your Forgey API here and append the reply as a "forgey" message
    setMessages((prev) => [
      ...prev,
      { id: prev.length, from: "user", text: value },
    ]);
    setInput("");
  };

  return (
    <section className="relative flex h-full min-h-[420px] flex-col rounded-[2rem] bg-white/50 p-3 dark:bg-white/[0.03]">
      {/* Tabs */}
      <div className="flex items-center gap-2 px-2 pb-3 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
                active
                  ? "bg-white text-orange-500 shadow-sm dark:bg-white/10"
                  : "text-zinc-500 hover:bg-white/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>

      {/* Forgey avatar */}
      <div className="absolute right-4 top-3 h-14 w-14 overflow-hidden rounded-full bg-orange-100 ring-4 ring-white/70 dark:bg-orange-500/20 dark:ring-white/5">
        <SvgForgey wave className="h-full w-full" />
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1 flex-col rounded-3xl bg-white p-4 dark:bg-white/[0.04]">
        <div
          ref={scrollRef}
          className="no-scrollbar flex-1 space-y-3 overflow-y-auto pr-1"
        >
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "flex",
                m.from === "user" ? "justify-end" : "justify-start",
              )}
            >
              <p
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6",
                  m.from === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-100 text-zinc-800 dark:bg-white/5 dark:text-zinc-200",
                )}
              >
                {m.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick prompts */}
        <div className="mt-3 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-600 transition hover:bg-orange-500/20 dark:text-orange-400"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="mt-3 flex items-center gap-2 rounded-full border border-black/5 bg-zinc-50 p-1.5 pl-5 transition focus-within:border-orange-500/40 dark:border-white/5 dark:bg-white/5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask Forgey anything..."
            className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-white"
          />

          <button
            onClick={() => send(input)}
            aria-label="Send"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}