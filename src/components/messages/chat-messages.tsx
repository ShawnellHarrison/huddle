import { messages as allMessages } from '@/lib/messages';
import { users } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import '@/app/messages.css';
import { cn } from '@/lib/utils';

export function ChatMessages({ channelId }: { channelId: string }) {
  const messages = allMessages.filter((m) => m.channelId === channelId);
  const currentUser = users[0]; // Assuming current user is Sarah (admin)

  return (
    <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
        {messages.map((message, index) => {
            const fromUser = users.find((u) => u.uid === message.fromUid);
            const isCurrentUser = message.fromUid === currentUser.uid;
            const showAvatar = index === 0 || messages[index - 1].fromUid !== message.fromUid;

            return (
            <div
                key={message.id}
                className={cn('flex items-start gap-4', {
                    'flex-row-reverse': isCurrentUser,
                })}
            >
                <div className="w-10 flex-shrink-0">
                    {showAvatar && fromUser && (
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={fromUser.photoURL} alt={fromUser.displayName} data-ai-hint="person face" />
                            <AvatarFallback>{fromUser.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
                <div className={cn("space-y-1 max-w-lg", isCurrentUser && 'text-right')}>
                    {showAvatar && fromUser && (
                        <div className={cn("flex items-baseline gap-2", isCurrentUser && "justify-end")}>
                            <p className="font-semibold">{fromUser.displayName}</p>
                            <p className="text-xs text-muted-foreground">
                                {format(message.createdAt, 'h:mm a')}
                            </p>
                        </div>
                    )}
                    <div
                        className={cn('chat-bubble', {
                            'chat-bubble-sent': isCurrentUser,
                            'chat-bubble-received': !isCurrentUser,
                        })}
                    >
                        <p>{message.text}</p>
                    </div>
                </div>
            </div>
            );
        })}
        </div>
    </ScrollArea>
  );
}
