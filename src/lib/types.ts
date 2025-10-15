export type UserRole = 'admin' | 'user' | 'client';
export type UserLevelName = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: UserRole;
  companyId: string;
  createdAt: Date;
  lastSeenAt: Date;
  level: number;
  xp: number;
  levelName: UserLevelName;
  status: 'online' | 'focus' | 'away';
}

export interface Channel {
  id: string;
  name: string;
  kind: 'team' | 'project' | 'dm';
  unreadCount?: number;
  members: string[];
}
