
'use client';

import { useState } from 'react';
import { InvoicesDataTable } from "@/components/invoices/invoices-data-table";
import { invoices, clients, users } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { generateRecurringInvoices } from '@/ai/flows/generate-recurring-invoices';
import { useToast } from '@/hooks/use-toast';

export default function InvoicesPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const currentUser = users.find(u => u.role === 'admin');

  const handleGenerateRecurring = async () => {
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not identify current user.',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateRecurringInvoices({ companyId: currentUser.companyId });
      toast({
        title: result.success ? 'Success' : 'Operation Finished',
        description: result.message,
      });
    } catch (error: any) {
      console.error('Failed to generate recurring invoices:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Invoices</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateRecurring} disabled={isGenerating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Recurring'}
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>
      <InvoicesDataTable data={invoices} clients={clients} />
    </div>
  );
}
