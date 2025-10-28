
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
import { clients } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function CrmPage() {

  const sortedClients = [...clients].sort((a, b) => b.dealValue - a.dealValue);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Clients</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </div>

        <Card className="cozy-panel">
            <CardHeader>
                <CardTitle className="font-headline">Client Pipeline</CardTitle>
                <CardDescription>Manage your client relationships and deal flow.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Deal Value</TableHead>
                        <TableHead>Last Contact</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedClients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={client.photoURL} data-ai-hint="company logo" />
                                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{client.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell className="text-right font-mono">${client.dealValue.toLocaleString()}</TableCell>
                            <TableCell>
                                {formatDistanceToNow(client.lastContactAt, { addSuffix: true })}
                            </TableCell>
                            <TableCell className="text-right">
                               <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5" />
                               </Button>
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
