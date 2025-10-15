import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { dailyMissions } from '@/lib/mock-data';
import { Target } from 'lucide-react';

export function DailyMissions() {
  return (
    <div className="cozy-panel">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Target className="text-accent" />
          Daily Missions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dailyMissions.map((mission) => (
          <div key={mission.id} className="flex items-center space-x-3">
            <Checkbox id={mission.id} checked={mission.completed} />
            <label
              htmlFor={mission.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[state=checked]:line-through data-[state=checked]:text-muted-foreground"
            >
              {mission.text}
            </label>
          </div>
        ))}
      </CardContent>
    </div>
  );
}
