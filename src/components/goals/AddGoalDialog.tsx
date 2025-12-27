import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useCreateGoal } from "@/hooks/useGoals";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddGoalDialogProps {
  children?: React.ReactNode;
}

export const AddGoalDialog = ({ children }: AddGoalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("finance");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("0");
  const [targetDate, setTargetDate] = useState("");
  const [dailyAction, setDailyAction] = useState("");
  
  const isMobile = useIsMobile();
  const createGoal = useCreateGoal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createGoal.mutateAsync({
      title,
      category,
      description: description || null,
      target_value: targetValue ? parseFloat(targetValue) : null,
      current_value: currentValue ? parseFloat(currentValue) : 0,
      target_date: targetDate || null,
      daily_action: dailyAction || null,
      is_active: true,
    });

    // Reset form and close
    setTitle("");
    setCategory("finance");
    setDescription("");
    setTargetValue("");
    setCurrentValue("0");
    setTargetDate("");
    setDailyAction("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="default" size={isMobile ? "sm" : "default"} className="gap-1 md:gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            {!isMobile && "Add Goal"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="e.g., Save $5,000 emergency fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What do you want to achieve?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Progress</Label>
              <Input
                id="currentValue"
                type="number"
                min="0"
                step="0.01"
                placeholder="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value</Label>
              <Input
                id="targetValue"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 5000"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date (optional)</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyAction">Daily Action (optional)</Label>
            <Input
              id="dailyAction"
              placeholder="e.g., Save $20/day"
              value={dailyAction}
              onChange={(e) => setDailyAction(e.target.value)}
            />
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
              disabled={createGoal.isPending}
            >
              {createGoal.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
