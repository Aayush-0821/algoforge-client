import type { ReactNode } from "react";
import { InterviewProvider } from "@/src/lib/interview/store";

export default function InterviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <InterviewProvider>
      {children}
    </InterviewProvider>
  );
}