
import type { User, Channel, Client, Invoice, LineItem } from '@/lib/types';
import { addDays, subDays } from 'date-fns';

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

export const teamWeekInReviewData: (User & { swi: number; tasksCompleted: number; kudos: number; })[] = [
  {
    ...users[0],
    swi: 92,
    tasksCompleted: 12,
    kudos: 5,
  },
  {
    ...users[4],
    swi: 88,
    tasksCompleted: 10,
    kudos: 3,
  },
  {
    ...users[2],
    swi: 82,
    tasksCompleted: 8,
    kudos: 7,
  },
];


export const weeklyReportData = {
  weekOf: "October 21, 2024",
  revenue: {
    amount: 15430,
    change: 12.5,
  },
  newClients: {
    count: 3,
    change: 25,
  },
  tasksCompleted: {
    count: 42,
    goal: 50,
  },
  topPerformer: "Jane",
  taskTrend: [
    { day: "Mon", tasks: 5 },
    { day: "Tue", tasks: 8 },
    { day: "Wed", tasks: 12 },
    { day: "Thu", tasks: 7 },
    { day: "Fri", tasks: 10 },
  ],
};

export const clients: Client[] = [
    { id: 'client-1', companyId: 'company-1', name: 'Innovate Inc.', email: 'contact@innovate.com', photoURL: 'https://picsum.photos/seed/client1/100/100', dealValue: 25000, lastContactAt: subDays(new Date(), 5) },
    { id: 'client-2', companyId: 'company-1', name: 'Apex Solutions', email: 'hello@apex.co', photoURL: 'https://picsum.photos/seed/client2/100/100', dealValue: 50000, lastContactAt: subDays(new Date(), 12) },
    { id: 'client-3', companyId: 'company-1', name: 'Quantum Leap', email: 'support@quantum.io', photoURL: 'https://picsum.photos/seed/client3/100/100', dealValue: 15000, lastContactAt: subDays(new Date(), 28) },
    { id: 'client-4', companyId: 'company-1', name: 'Momentum Co.', email: 'partner@momentum.co', photoURL: 'https://picsum.photos/seed/client4/100/100', dealValue: 75000, lastContactAt: subDays(new Date(), 2) },
];

export const invoices: Invoice[] = [
  {
    id: 'inv-001',
    companyId: 'company-1',
    clientId: 'client-1',
    number: '2024-001',
    status: 'paid',
    subtotal: 4000,
    tax: 800,
    total: 4800,
    currency: 'USD',
    dueDate: new Date('2024-09-15'),
    createdAt: new Date('2024-08-15'),
    repeatMonthly: true,
    lastGeneratedAt: new Date('2024-09-15'),
  },
  {
    id: 'inv-002',
    companyId: 'company-1',
    clientId: 'client-2',
    number: '2024-002',
    status: 'sent',
    subtotal: 2500,
    tax: 500,
    total: 3000,
    currency: 'USD',
    dueDate: new Date('2024-10-25'),
    createdAt: new Date('2024-09-25'),
  },
  {
    id: 'inv-003',
    companyId: 'company-1',
    clientId: 'client-3',
    number: '2024-003',
    status: 'draft',
    subtotal: 10000,
    tax: 2000,
    total: 12000,
    currency: 'USD',
    dueDate: addDays(new Date(), 10),
    createdAt: new Date(),
    repeatMonthly: true,
    lastGeneratedAt: new Date(),
  },
  {
    id: 'inv-004',
    companyId: 'company-1',
    clientId: 'client-1',
    number: '2024-004',
    status: 'overdue',
    subtotal: 1200,
    tax: 240,
    total: 1440,
    currency: 'USD',
    dueDate: subDays(new Date(), 5),
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
  },
];

export const lineItems: LineItem[] = [
    { id: 'li-1', invoiceId: 'inv-001', description: 'Monthly Retainer - August', qty: 1, unitPrice: 4000 },
    { id: 'li-2', invoiceId: 'inv-002', description: 'Design Sprint', qty: 1, unitPrice: 2500 },
    { id: 'li-3', invoiceId: 'inv-003', description: 'Full Stack Development (Q4)', qty: 1, unitPrice: 10000 },
    { id: 'li-4', invoiceId: 'inv-004', description: 'Emergency Server Support', qty: 3, unitPrice: 400 },
];
