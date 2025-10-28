'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { channels, directMessages, users } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export function MessageList() {
  const params = useParams();
  const currentUser = users.find(u => u.role === 'admin');

  return (
    <div className="flex h-full flex-col border-r bg-secondary/50">
      <div className="p-4">
        <h2 className="text-xl font-bold font-headline">Messages</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 pt-0">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Channels
            </h3>
            <div className="flex flex-col gap-1">
              {channels.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/messages/${channel.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-md p-2 text-sm hover:bg-accent',
                    params.channelId === channel.id && 'bg-accent font-semibold'
                  )}
                >
                  <span className="truncate"># {channel.name}</span>
                  {channel.unreadCount && channel.unreadCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/80 text-xs text-primary-foreground">
                      {channel.unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Direct Messages
            </h3>
            <div className="flex flex-col gap-1">
              {directMessages.map((dm) => {
                const otherUser = users.find(
                  (u) => dm.members.includes(u.uid) && u.uid !== currentUser?.uid
                );
                if (!otherUser) return null;

                return (
                  <Link
                    key={dm.id}
                    href={`/messages/${dm.id}`}
                    className={cn(
                      'flex items-center gap-2 rounded-md p-2 text-sm hover:bg-accent',
                      params.channelId === dm.id && 'bg-accent font-semibold'
                    )}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={otherUser.photoURL} data-ai-hint="person face" />
                      <AvatarFallback>{otherUser.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{otherUser.displayName}</span>
                     {dm.unreadCount && dm.unreadCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/80 text-xs text-primary-foreground">
                            {dm.unreadCount}
                        </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
