import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useCreateGoal } from "@/hooks/useGoals";
import { useIsMobile } from "@/hooks/use-mobile";
import { GoalFormFields } from "./GoalFormFields";

interface AddGoalDialogProps {
  children?: React.ReactNode;
}

const categoryTitlePlaceholders: Record<string, string> = {
  finance: "e.g., Save $5,000 emergency fund",
  fitness: "e.g., Run a marathon, Lose 10kg",
  learning: "e.g., Learn Spanish, Complete Python course",
  health: "e.g., Quit smoking, Sleep 8 hours daily",
  career: "e.g., Get promoted, Learn new skill",
  personal: "e.g., Read 50 books this year",
};

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

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    // Reset form fields when category changes
    setDescription("");
    setTargetValue("");
    setCurrentValue("0");
    setDailyAction("");
  };

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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance">💰 Finance</SelectItem>
                <SelectItem value="fitness">💪 Fitness</SelectItem>
                <SelectItem value="learning">📚 Learning</SelectItem>
                <SelectItem value="health">❤️ Health</SelectItem>
                <SelectItem value="career">💼 Career</SelectItem>
                <SelectItem value="personal">🎯 Personal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder={categoryTitlePlaceholders[category] || "Enter your goal"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <GoalFormFields
            category={category}
            description={description}
            setDescription={setDescription}
            targetValue={targetValue}
            setTargetValue={setTargetValue}
            currentValue={currentValue}
            setCurrentValue={setCurrentValue}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
            dailyAction={dailyAction}
            setDailyAction={setDailyAction}
          />

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
