import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { smartMoments } from '@/lib/mock-data';
import { Sparkles } from 'lucide-react';

export function SmartMoments() {
  return (
    <div className="cozy-panel">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Sparkles className="text-brand" />
          Smart Moments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {smartMoments.map((moment) => (
          <div key={moment.id} className="flex items-start gap-4 group">
            <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-brand transition-colors">
              <AvatarImage src={moment.user.photoURL} data-ai-hint="person face" />
              <AvatarFallback>{moment.user.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p>
                <span className="font-semibold">{moment.user.displayName}</span> {moment.text}
              </p>
              <p className="text-xs text-muted-foreground">{moment.time}</p>
            </div>
            <span className="text-2xl">{moment.emoji}</span>
          </div>
        ))}
      </CardContent>
    </div>
  );
}
