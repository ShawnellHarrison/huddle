'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { users } from '@/lib/mock-data';
import { User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusClasses: { [key in User['status']]: string } = {
  online: 'bg-green-500 text-green-500',
  away: 'bg-yellow-500 text-yellow-500',
  focus: 'bg-purple-500 text-purple-500',
};

const roleClasses: { [key in User['role']]: string } = {
    admin: 'bg-primary/20 text-primary',
    user: 'bg-muted-foreground/20 text-muted-foreground',
    client: 'bg-accent/20 text-accent'
}

export default function CrmPage() {
  const teamMembers = users.filter(u => u.role !== 'client');

  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>XP</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((user) => (
                        <TableRow key={user.uid}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.photoURL} data-ai-hint="person face" />
                                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span>{user.displayName}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={cn("capitalize", roleClasses[user.role])}>{user.role}</Badge>
                            </TableCell>
                            <TableCell>{user.level}</TableCell>
                            <TableCell>{user.xp}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className={cn("h-2 w-2 rounded-full", statusClasses[user.status])} />
                                    <span className="capitalize">{user.status}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
