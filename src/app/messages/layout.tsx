import { MessageList } from '@/components/messages/message-list';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-[calc(100vh-theme(spacing.16))] grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]">
      <MessageList />
      <div className="hidden h-full flex-col md:flex">{children}</div>
    </div>
  );
}
