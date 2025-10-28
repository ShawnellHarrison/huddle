import { Message } from '@/lib/types';
import { subMinutes } from 'date-fns';

export const messages: Message[] = [
  // Channel ch-1: general
  { id: 'msg-1', channelId: 'ch-1', fromUid: 'user-2', text: "Hey team, just pushed the latest updates for the Q4 roadmap. Let me know your thoughts!", createdAt: subMinutes(new Date(), 20) },
  { id: 'msg-2', channelId: 'ch-1', fromUid: 'user-3', text: "Looks great, Mike! The timeline seems tight but achievable. I'll start drafting the component specs for the new dashboard.", createdAt: subMinutes(new Date(), 18) },
  { id: 'msg-3', channelId: 'ch-1', fromUid: 'user-1', text: "Awesome work, Mike. Thanks, Jane. @Emily can you take a look at the mobile responsiveness for the new designs?", createdAt: subMinutes(new Date(), 15) },
  { id: 'msg-4', channelId: 'ch-1', fromUid: 'user-5', text: "On it, Sarah! Will get back to you by EOD.", createdAt: subMinutes(new Date(), 14) },
  { id: 'msg-5', channelId: 'ch-1', fromUid: 'user-2', text: "Perfect. Let's sync up tomorrow morning to finalize.", createdAt: subMinutes(new Date(), 10) },

  // Channel ch-4: project-hydra
  { id: 'msg-6', channelId: 'ch-4', fromUid: 'user-5', text: "Okay, I'm hitting a snag with the data hydration on the Hydra dashboard. The server-side render doesn't seem to match the client. Anyone seen this before?", createdAt: subMinutes(newDate(), 45) },
  { id: 'msg-7', channelId: 'ch-4', fromUid: 'user-2', text: "Ah, classic hydration mismatch. Check your `useEffect` hooks. Are you using `Math.random()` or `new Date()` outside of them?", createdAt: subMinutes(new Date(), 42) },
  { id: 'msg-8', channelId: 'ch-4', fromUid: 'user-5', text: "That was it! I had a `new Date()` call for a timestamp directly in the render. Moving it to `useEffect` fixed it. Thanks, Mike!", createdAt: subMinutes(new Date(), 30) },

  // DM dm-1: Mike
  { id: 'msg-9', channelId: 'dm-1', fromUid: 'user-2', text: "Hey Sarah, quick question about the Innovate Inc. invoice. Should I include the extra design hours from last week?", createdAt: subMinutes(new Date(), 5) },
  { id: 'msg-10', channelId: 'dm-1', fromUid: 'user-1', text: "Good question. Yes, please add them as a separate line item. They approved the overage.", createdAt: subMinutes(new Date(), 3) },
  { id: 'msg-11', channelId: 'dm-1', fromUid: 'user-2', text: "Will do. Thanks!", createdAt: subMinutes(new Date(), 1) },
];
