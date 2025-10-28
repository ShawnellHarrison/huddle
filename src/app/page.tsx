import { BusinessPulseChart } from "@/components/dashboard/business-pulse-chart";
import { DailyMissions } from "@/components/dashboard/daily-missions";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { SmartMoments } from "@/components/dashboard/smart-moments";
import { SwiRings } from "@/components/dashboard/swi-rings";
import { TeamWeekInReview } from "@/components/dashboard/team-week-in-review";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BusinessPulseChart />
        </div>
        <div className="row-span-2">
          <Leaderboard />
        </div>
        <div className="lg:col-span-2">
          <SwiRings />
        </div>
      </div>
      <div className="grid gap-6">
        <TeamWeekInReview />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SmartMoments />
        </div>
        <div>
          <DailyMissions />
        </div>
      </div>
    </div>
  );
}
