
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
import { getAuth } from 'firebase/auth';

interface UserNavProps {
  user: User;
}

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

export function UserNav({ user: mockUser }: UserNavProps) {
  const { user } = useUser();

  if (!user) {
    return null;
  }
  
  // Combine mock data with auth user data for display
  const displayUser = {
    ...mockUser,
    displayName: user.displayName || mockUser.displayName,
    email: user.email || mockUser.email,
    photoURL: user.photoURL || mockUser.photoURL,
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-auto w-full justify-start p-2 gap-2">
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarImage src={displayUser.photoURL} alt={displayUser.displayName} />
                <AvatarFallback>{displayUser.displayName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className={cn(
                "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-sidebar-background",
                statusIndicator[displayUser.status]
              )} />
            </div>
            <div className="flex flex-col items-start text-left group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium">{displayUser.displayName}</span>
              <span className="text-xs text-muted-foreground capitalize">{displayUser.role}</span>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{displayUser.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <div className="px-2 py-1.5 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className={cn("font-bold capitalize", levelColor[displayUser.levelName])}>
                Level {displayUser.level} - {displayUser.levelName}
              </span>
              <span className="text-muted-foreground">{displayUser.xp} / 1000 XP</span>
            </div>
            <div className="xp-outer">
              <div className="xp-inner rounded-full" style={{ width: `${(displayUser.xp / 1000) * 100}%` }} />
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
