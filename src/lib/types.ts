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

export interface Project {
    id: string;
    companyId: string;
    name: string;
    description: string;
    status: 'active' | 'archived';
    createdBy: string;
    members: string[];
    createdAt: Date;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    assignee: string;
    dueDate: Date;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    tags?: string[];
    commentsCount: number;
    attachmentsCount: number;
    order: number;
    companyId: string;
    createdAt: Date;
}
