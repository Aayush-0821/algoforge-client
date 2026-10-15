import Greeting from "@/src/components/dashboard/greeting/Greeting";
import Heatmap from "@/src/components/dashboard/heatmap/Heatmap";
import RecentActivity from "@/src/components/dashboard/recent/RecentActivity";
import ForgeyChat from "@/src/components/dashboard/chat/ForgeyChat";
import TodaysGoals from "@/src/components/dashboard/goals/TodayGoals";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Greeting name="Aadit" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[5fr_7fr]">
        <ForgeyChat />
        <TodaysGoals />
      </div>

      <RecentActivity />

      <Heatmap />
    </div>
  );
}