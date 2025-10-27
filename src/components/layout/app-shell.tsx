"use client"

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  React.useEffect(() => {
    if (auth && isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      if(email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            // The onAuthStateChanged listener will handle the redirect.
          })
          .catch((error) => {
            console.error("Sign in with email link error", error);
            toast({
                variant: 'destructive',
                title: 'Sign In Failed',
                description: 'The sign-in link is invalid or has expired. Please try again.',
            });
          });
      }
    }
  }, [auth, toast]);
  
  const isLoginPage = pathname === '/login';

  const showSidebar = !isLoginPage && !isUserLoading && user;
  const showHeader = !isLoginPage && !isUserLoading && user;

  return (
    <SidebarProvider>
      {showSidebar && <MainSidebar />}
      <SidebarInset className={cn(!showSidebar && "ml-0")}>
        {showHeader && <Header />}
        <main className={cn(
          "flex-1 overflow-y-auto",
          isLoginPage 
            ? "flex min-h-svh flex-col items-center justify-center bg-background"
            : "p-4 md:p-6 lg:p-8"
        )}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
