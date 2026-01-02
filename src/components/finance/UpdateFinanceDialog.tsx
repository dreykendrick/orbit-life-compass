import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useFinanceSettings, useUpdateFinanceSettings } from "@/hooks/useFinance";
import { useEffect } from "react";

interface UpdateFinanceDialogProps {
  children?: React.ReactNode;
}

export const UpdateFinanceDialog = ({ children }: UpdateFinanceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [currency, setCurrency] = useState("USD");
  
  const { data: settings } = useFinanceSettings();
  const updateSettings = useUpdateFinanceSettings();

  useEffect(() => {
    if (settings) {
      setMonthlyIncome(settings.monthly_income?.toString() || "");
      setCurrency(settings.currency || "USD");
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateSettings.mutateAsync({
      monthly_income: parseFloat(monthlyIncome) || 0,
      currency,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Finance Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income">Monthly Income</Label>
            <Input
              id="income"
              type="number"
              placeholder="e.g., 5000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
                <SelectItem value="CAD">CAD (C$)</SelectItem>
                <SelectItem value="AUD">AUD (A$)</SelectItem>
                <SelectItem value="TZS">TZS (TSh)</SelectItem>
                <SelectItem value="KES">KES (KSh)</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              disabled={updateSettings.isPending}
            >
              {updateSettings.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
