import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { teamWeekInReviewData } from '@/lib/mock-data';
import { TrendingUp, Trophy, Zap } from 'lucide-react';

export function TeamWeekInReview() {
  return (
    <Card className="cozy-panel">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Trophy className="text-yellow-400" />
          Team Week in Review
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {teamWeekInReviewData.map((member) => (
          <div key={member.uid} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg p-4 bg-secondary/50">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.photoURL} data-ai-hint="person face" />
              <AvatarFallback>{member.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-lg">{member.displayName}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-brand" />
                  <span>{member.swi} SWI</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-peach" />
                  <span>{member.tasksCompleted} Tasks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span>{member.kudos} Kudos</span>
                </div>
              </div>
            </div>
            <div className="text-right">
                <p className="text-2xl font-bold text-gradient-brand">{member.swi}</p>
                <p className="text-xs text-muted-foreground">SWI Score</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
