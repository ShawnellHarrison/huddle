import type { User, Channel } from '@/lib/types';

export const users: User[] = [
  {
    uid: 'user-1',
    displayName: 'Sarah',
    email: 'sarah@huddle.dev',
    photoURL: 'https://picsum.photos/seed/user1/100/100',
    role: 'admin',
    companyId: 'company-1',
    createdAt: new Date(),
    lastSeenAt: new Date(),
    level: 12,
    xp: 450,
    levelName: 'gold',
    status: 'online',
  },
  {
    uid: 'user-2',
    displayName: 'Mike',
    email: 'mike@huddle.dev',
    photoURL: 'https://picsum.photos/seed/user2/100/100',
    role: 'user',
    companyId: 'company-1',
    createdAt: new Date(),
    lastSeenAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    level: 8,
    xp: 210,
    levelName: 'silver',
    status: 'away',
  },
  {
    uid: 'user-3',
    displayName: 'Jane',
    email: 'jane@huddle.dev',
    photoURL: 'https://picsum.photos/seed/user3/100/100',
    role: 'user',
    companyId: 'company-1',
    createdAt: new Date(),
    lastSeenAt: new Date(),
    level: 9,
    xp: 890,
    levelName: 'silver',
    status: 'focus',
  },
  {
    uid: 'user-4',
    displayName: 'David',
    email: 'david@client.com',
    photoURL: 'https://picsum.photos/seed/user4/100/100',
    role: 'client',
    companyId: 'company-1',
    createdAt: new Date(),
    lastSeenAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    level: 1,
    xp: 0,
    levelName: 'bronze',
    status: 'away',
  },
  {
    uid: 'user-5',
    displayName: 'Emily',
    email: 'emily@huddle.dev',
    photoURL: 'https://picsum.photos/seed/user5/100/100',
    role: 'user',
    companyId: 'company-1',
    createdAt: new Date(),
    lastSeenAt: new Date(),
    level: 15,
    xp: 150,
    levelName: 'platinum',
    status: 'online',
  },
];

export const channels: Channel[] = [
    { id: 'ch-1', name: 'general', kind: 'team', unreadCount: 3, members: ['user-1', 'user-2', 'user-3', 'user-5'] },
    { id: 'ch-2', name: 'project-alpha', kind: 'project', unreadCount: 0, members: ['user-1', 'user-3'] },
    { id: 'ch-3', name: 'random', kind: 'team', unreadCount: 0, members: ['user-1', 'user-2', 'user-3', 'user-5'] },
    { id: 'ch-4', name: 'project-hydra', kind: 'project', unreadCount: 1, members: ['user-2', 'user-5'] },
];

export const directMessages: Channel[] = [
    { id: 'dm-1', name: 'Mike', kind: 'dm', unreadCount: 1, members: ['user-1', 'user-2'] },
    { id: 'dm-2', name: 'Jane', kind: 'dm', unreadCount: 0, members: ['user-1', 'user-3'] },
    { id: 'dm-3', name: 'Emily', kind: 'dm', unreadCount: 0, members: ['user-1', 'user-5'] },
];

export const dailyMissions = [
    { id: 'm1', text: 'Review project-alpha pull requests', completed: false },
    { id: 'm2', text: 'Send invoice #1024', completed: true },
    { id: 'm3', text: 'Follow up with David from Client Corp', completed: false },
    { id: 'm4', text: 'Plan weekly sync', completed: false },
];

export const smartMoments = [
    { id: 'sm1', user: users[4], text: 'closed a $5,000 deal!', emoji: '🎉', time: '2h ago'},
    { id: 'sm2', user: users[2], text: 'automated a deployment script.', emoji: '⚡', time: '8h ago'},
    { id: 'sm3', user: users[0], text: 'crushed 3 high-priority tasks.', emoji: '💡', time: '1d ago'},
    { id: 'sm4', user: users[1], text: 'got a "Smart Move" kudo from Sarah.', emoji: '👏', time: '2d ago'},
];

export const businessPulseData = [
  { date: 'Mon', Revenue: 2400, Tasks: 5 },
  { date: 'Tue', Revenue: 1398, Tasks: 3 },
  { date: 'Wed', Revenue: 9800, Tasks: 8 },
  { date: 'Thu', Revenue: 3908, Tasks: 4 },
  { date: 'Fri', Revenue: 4800, Tasks: 9 },
  { date: 'Sat', Revenue: 3800, Tasks: 2 },
  { date: 'Sun', Revenue: 4300, Tasks: 1 },
];
