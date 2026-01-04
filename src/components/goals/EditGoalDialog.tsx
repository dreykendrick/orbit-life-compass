import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateGoal, Goal } from "@/hooks/useGoals";
import { GoalFormFields } from "./GoalFormFields";

interface EditGoalDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryTitlePlaceholders: Record<string, string> = {
  finance: "e.g., Save $5,000 emergency fund",
  fitness: "e.g., Run a marathon, Lose 10kg",
  learning: "e.g., Learn Spanish, Complete Python course",
  health: "e.g., Quit smoking, Sleep 8 hours daily",
  career: "e.g., Get promoted, Learn new skill",
  personal: "e.g., Read 50 books this year",
};

export const EditGoalDialog = ({ goal, open, onOpenChange }: EditGoalDialogProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("finance");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [currentValue, setCurrentValue] = useState("0");
  const [targetDate, setTargetDate] = useState("");
  const [dailyAction, setDailyAction] = useState("");
  
  const updateGoal = useUpdateGoal();

  useEffect(() => {
    if (goal && open) {
      setTitle(goal.title);
      setCategory(goal.category);
      setDescription(goal.description || "");
      setTargetValue(goal.target_value?.toString() || "");
      setCurrentValue(goal.current_value?.toString() || "0");
      setTargetDate(goal.target_date || "");
      setDailyAction(goal.daily_action || "");
    }
  }, [goal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateGoal.mutateAsync({
      id: goal.id,
      title,
      category,
      description: description || null,
      target_value: targetValue ? parseFloat(targetValue) : null,
      current_value: currentValue ? parseFloat(currentValue) : 0,
      target_date: targetDate || null,
      daily_action: dailyAction || null,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={updateGoal.isPending}
            >
              {updateGoal.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
