
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { HuddleLogo } from '@/components/huddle-logo';
import {
  LayoutDashboard,
  MessageSquare,
  KanbanSquare,
  FileText,
  Users,
  Wallet,
  Clock,
  FileBox,
  BarChart3,
  Settings,
  Puzzle,
  Plus,
  Radio,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { channels, directMessages, users } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserNav } from '../user-nav';
import { useUser } from '@/firebase';
import { getAuth } from 'firebase/auth';

const mainNav = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/projects', icon: KanbanSquare, label: 'Projects' },
  { href: '/invoices', icon: FileText, label: 'Invoices' },
  { href: '/crm', icon: Users, label: 'CRM' },
  { href: '/expenses', icon: Wallet, label: 'Expenses' },
  { href: '/time', icon: Clock, label: 'Time' },
  { href: '/docs', icon: FileBox, label: 'Docs' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
  { href: '/subscription', icon: Sparkles, label: 'Subscription'},
  { href: '/integrations', icon: Puzzle, label: 'Integrations' },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  
  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut();
  }

  if (isUserLoading) {
    return (
      <Sidebar>
        <SidebarHeader>
          <HuddleLogo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          {/* You can add a skeleton loader here */}
        </SidebarContent>
      </Sidebar>
    )
  }

  if (!user) {
    return null;
  }
  
  // Find the full user profile from mock data using the authenticated user's UID
  const currentUser = users.find(u => u.email === user.email) || users[0];
  const otherUserForDM = users.find(u => u.uid !== currentUser.uid);

  return (
    <Sidebar>
      <SidebarHeader>
        <HuddleLogo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="flex flex-col gap-4">
          <Button className="btn btn-primary justify-center">
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
          
          <div className="relative">
            <Button className="w-full justify-center relative border-huddle font-bold">
                <Radio className="mr-2 h-4 w-4 animate-pulse" />
                Instant Huddle
            </Button>
          </div>

        </div>
        
        <SidebarMenu className="mt-4">
          {mainNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                  asChild
                >
                  
                    <item.icon />
                    <span>{item.label}</span>
                  
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Channels</SidebarGroupLabel>
          <SidebarMenu>
            {channels.map((channel) => (
              <SidebarMenuItem key={channel.id}>
                <Link href={`/messages/${channel.id}`} passHref>
                   <SidebarMenuButton
                      isActive={pathname === `/messages/${channel.id}`}
                      tooltip={channel.name}
                      className="justify-start"
                      size="sm"
                      asChild
                    >
                      <>
                        <span className="truncate"># {channel.name}</span>
                        {channel.unreadCount && channel.unreadCount > 0 && (
                           <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">{channel.unreadCount}</span>
                        )}
                      </>
                   </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
          <SidebarMenu>
            {directMessages.map((dm) => {
              const otherUser = users.find(u => dm.members.includes(u.uid) && u.uid !== currentUser.uid);
              if (!otherUser) return null;

              return (
              <SidebarMenuItem key={dm.id}>
                <Link href={`/messages/${dm.id}`} passHref>
                   <SidebarMenuButton
                      isActive={pathname === `/messages/${dm.id}`}
                      tooltip={otherUser.displayName}
                      className="justify-start"
                      size="sm"
                      asChild
                    >
                      <>
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={otherUser.photoURL} alt={otherUser.displayName} data-ai-hint="person face" />
                          <AvatarFallback>{otherUser.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{otherUser.displayName}</span>
                        {dm.unreadCount && dm.unreadCount > 0 && (
                           <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">{dm.unreadCount}</span>
                        )}
                      </>
                   </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )})}
          </SidebarMenu>
        </SidebarGroup>
        
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <UserNav />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="w-full">
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
