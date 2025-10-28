'use client';
import React from 'react';
import { projects, tasks } from '@/lib/projects';
import { TaskCard } from './task-card';
import { PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export function ProjectKanban() {
  const currentProject = projects[0];

  return (
    <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 px-1">
            <div>
                <h1 className="text-2xl font-bold font-headline">{currentProject.name}</h1>
                <p className="text-muted-foreground">{currentProject.description}</p>
            </div>
            <Button>
                <PlusSquare className="mr-2 h-4 w-4" />
                Add Task
            </Button>
        </div>
        <ScrollArea className="flex-1">
            <div className="flex gap-6 pb-4">
            {columns.map((column) => (
                <div key={column.id} className="w-80 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold font-headline capitalize">{column.title.replace('_', ' ')}</h2>
                        <span className="text-sm font-bold text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                        {tasks.filter((task) => task.status === column.id).length}
                        </span>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-2 min-h-[500px]">
                        {tasks
                        .filter((task) => task.status === column.id)
                        .map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                </div>
            ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
  );
}
