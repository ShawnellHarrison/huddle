'use client';

import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UploadCloud, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { categorizeExpense } from '@/ai/flows/categorize-expenses';
import { format } from 'date-fns';

// Mock data for initial state
const initialExpenses = [
  {
    id: 'exp-1',
    vendor: 'Staples',
    date: new Date('2024-10-20'),
    amount: 75.4,
    currency: 'USD',
    category: 'Supplies',
    imagePath: 'https://picsum.photos/seed/receipt1/200/300',
    ocrRaw: 'STAPLES\nOffice Supplies\nTotal: $75.40',
  },
  {
    id: 'exp-2',
    vendor: 'The Coffee Shop',
    date: new Date('2024-10-21'),
    amount: 12.8,
    currency: 'USD',
    category: 'Food',
    imagePath: 'https://picsum.photos/seed/receipt2/200/300',
    ocrRaw: 'The Coffee Shop\nLatte, Croissant\nTotal: $12.80',
  },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [vendor, setVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // Simulate OCR and auto-fill
        setVendor('Mock Vendor');
        setAmount('42.00');
        toast({
          title: 'Receipt Scanned',
          description: "We've filled in some details from the receipt.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiCategorize = async () => {
    setIsCategorizing(true);
    // In a real app, we'd use actual OCR text from the uploaded image.
    const mockOcrText = `Receipt from ${vendor} for ${amount} dollars for office supplies and coffee.`;
    
    try {
      const result = await categorizeExpense({ ocrRaw: mockOcrText });
      if (result.category) {
        setCategory(result.category);
        toast({
          title: 'AI Suggestion',
          description: `We've categorized this as "${result.category}".`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Categorization Failed',
        description: 'Could not get a category suggestion.',
      });
    } finally {
      setIsCategorizing(false);
    }
  };
  
  const handleAddExpense = () => {
    if (!vendor || !amount || !date || !category) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please fill out all fields to add an expense.',
        });
        return;
    }

    const newExpense = {
        id: `exp-${Date.now()}`,
        vendor,
        date: new Date(date),
        amount: parseFloat(amount),
        currency: 'USD',
        category,
        imagePath: imagePreview || '',
        ocrRaw: 'Simulated OCR data',
    };

    setExpenses([newExpense, ...expenses]);
    
    // Reset form
    setVendor('');
    setAmount('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setCategory('');
    setImagePreview(null);
    
    toast({
        title: 'Expense Added',
        description: `${vendor} expense has been logged.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Expenses</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="cozy-panel">
            <CardHeader>
              <CardTitle>Log New Expense</CardTitle>
              <CardDescription>Upload a receipt or enter details manually.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="receipt-upload">Receipt Image</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10">
                  <div className="text-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Receipt preview" className="mx-auto h-32 object-contain" />
                    ) : (
                      <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                      <label
                        htmlFor="receipt-upload"
                        className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80"
                      >
                        <span>Upload a file</span>
                        <input id="receipt-upload" name="receipt-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground/80">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input id="vendor" placeholder="e.g., Amazon, Starbucks" value={vendor} onChange={(e) => setVendor(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                    <Input id="category" placeholder="e.g., Software, Travel" value={category} onChange={(e) => setCategory(e.target.value)} />
                    <Button variant="outline" size="icon" onClick={handleAiCategorize} disabled={isCategorizing || !vendor}>
                        <Bot className={`h-5 w-5 ${isCategorizing ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAddExpense}>Add Expense</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="cozy-panel h-full">
            <CardHeader>
                <CardTitle>Expense History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                            <TableCell className="font-medium">{expense.vendor}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{expense.category}</Badge>
                            </TableCell>
                            <TableCell>{format(expense.date, 'MMM d, yyyy')}</TableCell>
                            <TableCell className="text-right font-mono">${expense.amount.toFixed(2)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
