
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, LogIn, LogOut, PartyPopper } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { HuddleLogo } from '@/components/huddle-logo';
import { useToast } from '@/hooks/use-toast';

const features = [
  'Access to all premium features',
  'Priority customer support',
  'Advanced analytics dashboard',
  'Unlimited exports',
  'API access',
];

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

export default function SubscriptionPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isPremium, setIsPremium] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user && firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setIsPremium(userData.isPremium || false);
        } else {
          setIsPremium(false);
        }
      });
      return () => unsubscribe();
    } else {
      setIsPremium(false);
    }
  }, [user, firestore]);

  const handleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Sign in error:', error);
       toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "Could not sign in with Google.",
      });
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error: any) {
        console.error("Sign out error", error);
        toast({ variant: "destructive", title: "Sign Out Failed" });
    }
  };
  
  const handleSubscribeClick = () => {
    if (!user) {
        handleSignIn();
        return;
    }
    
    setIsProcessing(true);
    // Construct the checkout URL with the user's ID and email in the metadata
    const checkoutUrl = new URL('https://buy.stripe.com/test_00g8xq8J5fHr9eUeUU');
    checkoutUrl.searchParams.set('client_reference_id', user.uid);
    
    if(user.email) {
      checkoutUrl.searchParams.set('prefilled_email', user.email);
    }

    // Redirect to Stripe checkout
    window.location.href = checkoutUrl.toString();
  }
  
  if(isUserLoading){
      return (
        <div className="flex items-center justify-center h-screen">
            <HuddleLogo className="text-2xl animate-pulse" />
        </div>
      )
  }

  return (
    <div className="flex items-center justify-center min-h-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4">
      <Card className="max-w-md w-full shadow-2xl rounded-2xl">
        <CardHeader className="text-center p-6">
           {user ? (
             <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
                <Button variant="link" onClick={handleSignOut} className="text-destructive h-auto p-0 mt-1">
                    <LogOut className="mr-2" />
                    Sign Out
                </Button>
             </div>
           ) : (
             <div className="bg-muted p-4 rounded-lg flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">Sign in to subscribe</p>
                <Button onClick={handleSignIn} className="bg-white text-gray-700 hover:bg-gray-100 shadow">
                    <GoogleIcon />
                    Sign In with Google
                </Button>
            </div>
           )}
        </CardHeader>
        <CardContent className="px-6 pb-6 text-center">
          <CardTitle className="text-3xl font-headline">Premium Plan</CardTitle>
          <CardDescription className="mb-6">
            Unlock all premium features
          </CardDescription>
          <div className="mb-6">
            <span className="text-5xl font-bold text-primary">$29</span>
            <span className="text-muted-foreground">/ month</span>
          </div>

          <div className="space-y-3 mb-8 text-left">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 border-b pb-3 last:border-b-0">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        
          {isPremium ? (
              <div className="text-center space-y-4">
                  <Badge className="bg-green-500 hover:bg-green-600 text-primary-foreground text-sm py-1 px-4 rounded-full">
                    <PartyPopper className="mr-2"/> Premium Member
                  </Badge>
                  <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 p-3 rounded-md">
                     You have access to all premium features!
                  </div>
              </div>
          ) : (
            <Button
                onClick={handleSubscribeClick}
                disabled={isProcessing || !user}
                className={cn(
                    'w-full btn btn-primary text-lg font-semibold py-6 rounded-xl hover:scale-105 transition-transform duration-200',
                    !user && 'opacity-60 cursor-not-allowed'
                )}
            >
                {isProcessing ? "Redirecting..." : "Subscribe Now"}
            </Button>
          )}
           {!user && !isPremium && (
             <p className="message info-message text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/50 mt-4 rounded-md p-3 text-sm">
                Please sign in to continue
             </p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
