import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Video, Info } from 'lucide-react';

interface ChatHeaderProps {
  channelName: string;
  channelImage?: string;
}

export function ChatHeader({ channelName, channelImage }: ChatHeaderProps) {
  return (
    <div className="flex h-16 items-center border-b px-6">
      <div className="flex items-center gap-3">
        {channelImage ? (
            <Avatar className="h-8 w-8">
                <AvatarImage src={channelImage} alt={channelName} data-ai-hint="person face" />
                <AvatarFallback>{channelName.charAt(0)}</AvatarFallback>
            </Avatar>
        ): (
            <span className="text-muted-foreground">#</span>
        )}
        <h2 className="text-lg font-semibold">{channelName}</h2>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
