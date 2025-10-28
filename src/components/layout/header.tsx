

"use client"

import { Button } from '@/components/ui/button';
import { Bell, Search, ChevronLeft, ChevronRight, Coffee } from 'lucide-react';
import { SearchCommand } from '@/components/search-command';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { users } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

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
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const pageTitle = pathname === '/' ? 'Lobby' : (pathname.split('/').pop() || 'lobby').replace('-', ' ');

  const handleCoffeeClick = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=coffee&ll=${latitude},${longitude}`;
        window.open(mapsUrl, '_blank');
      },
      (error) => {
        toast({
          variant: 'destructive',
          title: 'Could not get location',
          description: 'Please enable location services in your browser settings.',
        });
      }
    );
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex-1 md:ml-0 ml-10 flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.forward()} className="h-8 w-8">
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Forward</span>
          </Button>
        </div>
        <h1 className="text-lg font-headline font-semibold capitalize">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <PresenceAvatars />
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setOpenSearch(true)}>
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleCoffeeClick}>
            <Coffee className="h-5 w-5" />
            <span className="sr-only">Find nearest coffee shop</span>
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
