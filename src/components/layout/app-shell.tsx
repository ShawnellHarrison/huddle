"use client"

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <SidebarProvider>
      {!isLoginPage && <MainSidebar />}
      <SidebarInset className={cn(isLoginPage && "ml-0")}>
        {!isLoginPage && <Header />}
        <main className={cn(
          "flex-1 overflow-y-auto",
          isLoginPage 
            ? "flex min-h-svh flex-col items-center justify-center bg-background p-4"
            : "p-4 md:p-6 lg:p-8"
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
