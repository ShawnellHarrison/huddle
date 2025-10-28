
import { BackButton } from '@/components/back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { invoices, clients, lineItems, users } from '@/lib/mock-data';
import { InvoiceStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Download, CreditCard, Send } from 'lucide-react';

const statusColors: Record<InvoiceStatus, string> = {
  paid: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  sent: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  draft: 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30',
  overdue: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
};


export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = invoices.find((inv) => inv.id === params.id);
  const client = clients.find((c) => c.id === invoice?.clientId);
  const relevantLineItems = lineItems.filter((li) => li.invoiceId === invoice?.id);
  const companyUser = users.find(u => u.role === 'admin');

  if (!invoice || !client || !companyUser) {
    return (
        <div className="flex flex-col items-start h-full text-left">
            <BackButton />
            <div className="flex flex-col items-center justify-center h-full text-center w-full -mt-12">
                <h1 className="text-4xl font-bold font-headline">Invoice not found</h1>
                <p className="text-muted-foreground mt-2">The invoice you are looking for does not exist.</p>
            </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        <Card className="cozy-panel overflow-hidden">
            <CardHeader className="bg-secondary/30 p-6 flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Invoice {invoice.number}</h1>
                    <p className="text-muted-foreground text-sm">Issued on {format(invoice.createdAt, 'MMMM d, yyyy')}</p>
                </div>
                <Badge className={cn("capitalize text-base px-3 py-1", statusColors[invoice.status])}>{invoice.status}</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Bill To</h3>
                        <div className="text-muted-foreground">
                            <p className="font-bold text-foreground">{client.name}</p>
                            <p>{client.email}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h3 className="font-semibold mb-2">From</h3>
                        <div className="text-muted-foreground">
                            <p className="font-bold text-foreground">Huddle Inc.</p>
                            <p>{companyUser.email}</p>
                        </div>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60%]">Description</TableHead>
                            <TableHead className="text-center">QTY</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {relevantLineItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.description}</TableCell>
                                <TableCell className="text-center">{item.qty}</TableCell>
                                <TableCell className="text-right font-mono">${item.unitPrice.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-mono">${(item.qty * item.unitPrice).toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                <div className="flex justify-end">
                    <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="font-mono">${invoice.subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between text-muted-foreground">
                            <span>Tax</span>
                            <span className="font-mono">${invoice.tax.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="font-mono">${invoice.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-secondary/30 p-6 flex justify-between items-center">
                 <p className="text-muted-foreground text-sm">Due on {format(invoice.dueDate, 'MMMM d, yyyy')}</p>
                 <div className="flex gap-2">
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
                    <Button><CreditCard className="mr-2 h-4 w-4" /> Pay Now</Button>
                 </div>
            </CardFooter>
        </Card>
    </div>
  )
}
