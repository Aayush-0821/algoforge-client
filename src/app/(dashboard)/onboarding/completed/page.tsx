"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Forgey from "@/src/components/mascot/Forgey";

export default function OnboardingCompletedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      className="
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        bg-white
        dark:bg-[#09090B]
      "
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="
            mb-8
            animate-[bounce_2s_infinite]
          "
        >
          <Forgey />
        </div>


        <h1
          className="
            text-3xl
            font-bold
            tracking-tight
            text-zinc-900
            dark:text-white
          "
        >
          Profile Completed 🎉
        </h1>


        <p
          className="
            mt-3
            text-sm
            text-zinc-500
            dark:text-zinc-400
          "
        >
          Forgey is preparing coding workspace...
        </p>
        
        <div className="mt-6 flex gap-2">

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-orange-500
              animate-bounce
            "
          />

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-orange-500
              animate-bounce
              [animation-delay:200ms]
            "
          />

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-orange-500
              animate-bounce
              [animation-delay:400ms]
            "
          />

        </div>

      </div>
    </main>
  );
}