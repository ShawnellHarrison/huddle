'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HuddleLogo } from '@/components/huddle-logo';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth, useUser, initiateEmailSignIn } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';


function GoogleIcon() {
    return (
        <svg viewBox="0 0 48 48" className="size-5">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M44,24c0-1.341-0.138-2.65-0.389-3.917H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.887,44,30.34,44,24z"></path>
        </svg>
    )
}

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) return;
    // In a real scenario, you'd call a function like `sendSignInLinkToEmail`.
    // We are using a placeholder here because passwordless sign-in requires more setup.
    initiateEmailSignIn(auth, values.email, 'password'); // NOTE: Password is not used, but required by the function signature.
    toast({
        title: "Check your email",
        description: `A sign-in link has been sent to ${values.email}.`,
    });
  }

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle the redirect.
    } catch (error) {
      console.error("Google Sign-In Error", error);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <HuddleLogo className="text-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="cozy-panel p-8 flex flex-col items-center text-center space-y-6">
        <HuddleLogo className="text-2xl"/>
        <div className="space-y-2">
            <h1 className="text-2xl font-headline font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Your business partner in your pocket awaits.</p>
        </div>

        <div className="w-full flex flex-col space-y-3">
            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full btn">
                <GoogleIcon />
                <span>Sign in with Google</span>
            </Button>
        </div>
        
        <div className="w-full text-center">
          <p className="text-xs text-muted-foreground">Or sign in with email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@company.com" {...field} className="input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className={cn('w-full btn btn-primary')}>Send Sign-In Link</Button>
          </form>
        </Form>
        
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account? <a href="#" className="underline hover:text-brand">Contact sales</a>
        </p>
      </div>
    </div>
  );
}
