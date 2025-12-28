import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2 } from "lucide-react";
import { useCreateExpense } from "@/hooks/useFinance";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddExpenseDialogProps {
  children?: React.ReactNode;
}

export const AddExpenseDialog = ({ children }: AddExpenseDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [isFixed, setIsFixed] = useState(true);
  const [frequency, setFrequency] = useState("monthly");
  
  const isMobile = useIsMobile();
  const createExpense = useCreateExpense();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createExpense.mutateAsync({
      title,
      amount: parseFloat(amount),
      category,
      is_fixed: isFixed,
      frequency: isFixed ? frequency : null,
    });

    // Reset form and close
    setTitle("");
    setAmount("");
    setCategory("other");
    setIsFixed(true);
    setFrequency("monthly");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Expense Name</Label>
            <Input
              id="title"
              placeholder="e.g., Netflix subscription"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="e.g., 15.99"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="subscriptions">Subscriptions</SelectItem>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="fixed">Fixed expense (recurring)</Label>
            <Switch
              id="fixed"
              checked={isFixed}
              onCheckedChange={setIsFixed}
            />
          </div>

          {isFixed && (
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createExpense.isPending}
            >
              {createExpense.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
