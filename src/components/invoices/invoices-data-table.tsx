'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Invoice, Client, InvoiceStatus } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const statusColors: Record<InvoiceStatus, string> = {
  paid: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
  sent: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
  draft: 'bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30',
  overdue: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30',
};

export function InvoicesDataTable({ data, clients }: { data: Invoice[], clients: Client[] }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const clientMap = React.useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'number',
      header: 'Invoice #',
      cell: ({ row }) => <div className="font-medium">{row.getValue('number')}</div>,
    },
    {
      accessorKey: 'clientId',
      header: 'Client',
      cell: ({ row }) => {
        const client = clientMap.get(row.getValue('clientId'));
        return (
          <div className="flex items-center gap-3">
             <Avatar className="h-8 w-8">
                <AvatarImage src={client?.photoURL} data-ai-hint="company logo" />
                <AvatarFallback>{client?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{client?.name || 'Unknown Client'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'total',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('total'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        return <div className="text-right font-mono">{formatted}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="outline" className={cn('capitalize', statusColors[row.getValue('status') as InvoiceStatus])}>
          {row.getValue('status')}
        </Badge>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => {
        const date = row.getValue('dueDate') as Date;
        return <div>{format(date, 'MMM d, yyyy')}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}`)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <Card className="cozy-panel">
      <CardContent className="p-0">
        <div className="flex items-center p-4 border-b">
          <Input
            placeholder="Filter by client..."
            value={(table.getColumn('clientId')?.getFilterValue() as string) ?? ''}
            onChange={(event) => {
                 const client = clients.find(c => c.name.toLowerCase().includes(event.target.value.toLowerCase()));
                 table.getColumn('clientId')?.setFilterValue(client ? client.id : 'INVALID_CLIENT_ID_FORCE_NO_RESULTS');
            }}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id.replace(/([A-Z])/g, ' $1')}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => router.push(`/invoices/${row.original.id}`)}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
