
"use client"
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/types';
import { Settings, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { users } from '@/lib/mock-data';

const statusIndicator: { [key in User['status']]: string } = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  focus: 'bg-purple-500',
}

const levelColor: { [key in User['levelName']]: string } = {
  bronze: 'text-[#cd7f32]',
  silver: 'text-[#c0c0c0]',
  gold: 'text-[#ffd700]',
  platinum: 'text-[#e5e4e2]',
}

export function UserNav() {
  const { user } = useUser();

  if (!user) {
    return null;
  }
  
  // Find the full user profile from mock data using the authenticated user's email
  const currentUser = users.find(u => u.email === user.email) || {
      uid: user.uid,
      displayName: user.displayName || 'Anonymous',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: 'user',
      companyId: '',
      createdAt: new Date(),
      lastSeenAt: new Date(),
      level: 1,
      xp: 0,
      levelName: 'bronze',
      status: 'online',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-auto w-full justify-start p-2 gap-2">
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName} />
                <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className={cn(
                "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-sidebar-background",
                statusIndicator[currentUser.status]
              )} />
            </div>
            <div className="flex flex-col items-start text-left group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium">{currentUser.displayName}</span>
              <span className={cn("text-xs capitalize", levelColor[currentUser.levelName])}>
                Level {currentUser.level} - {currentUser.levelName}
              </span>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{currentUser.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <div className="px-2 py-1.5 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className={cn("font-bold capitalize", levelColor[currentUser.levelName])}>
                Level {currentUser.level}
              </span>
              <span className="text-muted-foreground">{currentUser.xp} / 1000 XP</span>
            </div>
            <div className="xp-outer">
              <div className="xp-inner rounded-full" style={{ width: `${(currentUser.xp / 1000) * 100}%` }} />
            </div>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <Link href="/settings/profile" passHref>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
