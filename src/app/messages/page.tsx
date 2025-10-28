import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="hidden h-full flex-col items-center justify-center lg:flex">
      <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
      <p className="mt-4 text-lg text-muted-foreground">
        Select a channel to start messaging
      </p>
    </div>
  );
}
