'use client';
import { ChatHeader } from '@/components/messages/chat-header';
import { ChatInput } from '@/components/messages/chat-input';
import { ChatMessages } from '@/components/messages/chat-messages';
import { channels, directMessages, users } from '@/lib/mock-data';

export default function ChannelPage({
  params,
}: {
  params: { channelId: string };
}) {
  const allChannels = [...channels, ...directMessages];
  const channel = allChannels.find((c) => c.id === params.channelId);

  if (!channel) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Channel not found</p>
      </div>
    );
  }
  
  const currentUser = users.find(u => u.role === 'admin'); // Assuming 'admin' is the current user
  let channelName = channel.name;
  let channelImage = '';
  if (channel.kind === 'dm') {
    const otherUser = users.find(u => channel.members.includes(u.uid) && u.uid !== currentUser?.uid);
    if(otherUser) {
      channelName = otherUser.displayName;
      channelImage = otherUser.photoURL;
    }
  }


  return (
    <div className="flex h-full flex-col">
      <ChatHeader channelName={channelName} channelImage={channelImage} />
      <ChatMessages channelId={params.channelId} />
      <ChatInput />
    </div>
  );
}
