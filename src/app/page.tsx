import { BusinessPulseChart } from "@/components/dashboard/business-pulse-chart";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { TeamWeekInReview } from "@/components/dashboard/team-week-in-review";

export default function LobbyPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BusinessPulseChart />
        </div>
        <div>
          <Leaderboard />
        </div>
      </div>
      <div>
        <TeamWeekInReview />
      </div>
    </div>
  );
}
