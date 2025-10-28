
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, LogIn } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { HuddleLogo } from '@/components/huddle-logo';

const features = [
  'Access to all premium features',
  'Priority customer support',
  'Advanced analytics dashboard',
  'Unlimited exports',
  'API access',
];

export default function SubscriptionPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isPremium, setIsPremium] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
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
    // Passing email is helpful for customer management in Stripe
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
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="text-center p-6">
           {user ? (
             <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
                <Button variant="link" onClick={handleSignOut} className="text-destructive h-auto p-0 mt-1">Sign Out</Button>
             </div>
           ) : (
             <div className="bg-muted p-4 rounded-lg flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">Sign in to subscribe</p>
                <Button onClick={handleSignIn}>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>
            </div>
           )}
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="text-center">
            <CardTitle className="text-3xl font-headline">Premium Plan</CardTitle>
            <CardDescription className="mb-6">
              Unlock all premium features
            </CardDescription>
            <div className="mb-6">
              <span className="text-5xl font-bold text-primary">$29</span>
              <span className="text-muted-foreground">/ month</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        
          {isPremium ? (
              <div className="text-center">
                  <Badge className="bg-green-500 text-primary-foreground mb-4">✓ Premium Member</Badge>
                  <div className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 p-3 rounded-md">
                     You have access to all premium features!
                  </div>
              </div>
          ) : (
            <Button
                onClick={handleSubscribeClick}
                disabled={isProcessing}
                className={cn('w-full btn btn-primary')}>
                {isProcessing ? "Redirecting..." : (user ? "Subscribe Now" : "Sign In & Subscribe")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
