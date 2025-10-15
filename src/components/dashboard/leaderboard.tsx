import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/mock-data';
import { Crown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const sortedUsers = [...users]
    .filter(u => u.role !== 'client')
    .sort((a, b) => b.level * 1000 + b.xp - (a.level * 1000 + a.xp));

export function Leaderboard() {
  return (
    <div className="cozy-panel h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Zap className="text-peach" />
          Top Smart Movers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedUsers.slice(0, 3).map((user, index) => (
          <div key={user.uid} className={cn("flex items-center gap-4 p-3 rounded-lg", index === 0 && "bg-brand/10 border border-brand/20 relative border-huddle")}>
            {index === 0 && <Crown className="h-6 w-6 text-yellow-400" />}
            {index > 0 && <span className="w-6 text-center font-bold text-muted-foreground">{index + 1}</span>}

            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL} data-ai-hint="person face" />
              <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{user.displayName}</p>
              <p className="text-sm text-muted-foreground">Level {user.level}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-brand">{user.xp} XP</p>
                <p className="text-xs text-muted-foreground">This week</p>
            </div>
          </div>
        ))}
      </CardContent>
    </div>
  );
}
