import { InvoicesDataTable } from "@/components/invoices/invoices-data-table";
import { invoices, clients } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Invoices</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>
      <InvoicesDataTable data={invoices} clients={clients} />
    </div>
  );
}
