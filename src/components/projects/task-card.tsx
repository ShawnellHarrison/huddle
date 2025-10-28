'use client';

import { Task, User } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { users } from '@/lib/mock-data';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Paperclip } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const assignee = users.find((user: User) => user.uid === task.assignee);

  return (
    <Card className="cozy-panel mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <span className="text-sm font-semibold">{task.title}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        <div className="mt-2 flex space-x-2">
          {task.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {assignee && (
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={assignee.photoURL} alt={assignee.displayName} />
                            <AvatarFallback>{assignee.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{assignee.displayName}</p>
                    </TooltipContent>
                </Tooltip>
             </TooltipProvider>
          )}
          <span className="text-xs text-muted-foreground">
            Due {formatDistanceToNow(task.dueDate, { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1 text-xs">
            <MessageSquare className="h-3 w-3" />
            <span>{task.commentsCount}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Paperclip className="h-3 w-3" />
            <span>{task.attachmentsCount}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
