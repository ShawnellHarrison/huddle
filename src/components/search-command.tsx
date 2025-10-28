
"use client"

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { FileText, KanbanSquare, LayoutDashboard, MessageSquare, Users, Wallet, BarChart3, Sparkles, Megaphone, Camera } from 'lucide-react';
import { users, channels } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const mainNav = [
    { href: '/', icon: LayoutDashboard, label: 'Lobby' },
    { href: '/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/projects', icon: KanbanSquare, label: 'Projects' },
    { href: '/invoices', icon: FileText, label: 'Invoices' },
    { href: '/crm', icon: Users, label: 'CRM' },
    { href: '/snap-to-add', icon: Camera, label: 'Snap to Add' },
    { href: '/expenses', icon: Wallet, label: 'Expenses' },
    { href: '/reports', icon: BarChart3, label: 'Reports' },
    { href: '/brand-voice', icon: Megaphone, label: 'Brand Voice' },
    { href: '/subscription', icon: Sparkles, label: 'Subscription'},
];

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search tasks, messages, invoices, clients..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
            {mainNav.map((item) => (
                <CommandItem key={item.href} onSelect={() => runCommand(() => router.push(item.href))}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Channels">
            {channels.map((channel) => (
                <CommandItem key={channel.id} onSelect={() => runCommand(() => router.push(`/messages/${channel.id}`))}>
                    <span className="mr-2">#</span>
                    <span>{channel.name}</span>
                </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Users">
            {users.filter(u => u.role !== 'client').map((user) => (
                <CommandItem key={user.uid} onSelect={() => runCommand(() => router.push(`/messages/`))}>
                     <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="person face" />
                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.displayName}</span>
                </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
