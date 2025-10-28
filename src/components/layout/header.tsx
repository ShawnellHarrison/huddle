
"use client"

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Search } from 'lucide-react';
import { SearchCommand } from '@/components/search-command';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { users } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function PresenceAvatars() {
    const onlineUsers = users.filter(u => u.status !== 'away' && u.role !== 'client');
    return (
        <div className="flex items-center -space-x-2">
            {onlineUsers.map(user => (
                <Avatar key={user.uid} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="person face" />
                    <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
            ))}
        </div>
    )
}

export function Header() {
  const [openSearch, setOpenSearch] = useState(false);
  const pathname = usePathname();
  const pageTitle = (pathname.split('/').pop() || 'dashboard').replace('-', ' ');

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        <h1 className="text-lg font-headline font-semibold capitalize">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <PresenceAvatars />
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setOpenSearch(true)}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
      <SearchCommand open={openSearch} setOpen={setOpenSearch} />
    </header>
  );
}
