import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Mic, SendHorizonal } from 'lucide-react';

export function ChatInput() {
  return (
    <div className="border-t bg-background p-4">
      <div className="relative">
        <Textarea
          placeholder="Type a message..."
          className="resize-none rounded-lg border-2 border-input bg-secondary/50 pr-28"
          rows={1}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
           <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon">
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
