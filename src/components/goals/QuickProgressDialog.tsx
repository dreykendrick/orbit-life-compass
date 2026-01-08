import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Loader2, Minus, Plus, Target } from "lucide-react";
import { useUpdateGoal, Goal } from "@/hooks/useGoals";

interface QuickProgressDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickProgressDialog = ({ goal, open, onOpenChange }: QuickProgressDialogProps) => {
  const [currentValue, setCurrentValue] = useState(0);
  const updateGoal = useUpdateGoal();

  const targetValue = goal.target_value || 100;
  const progress = Math.min(Math.round((currentValue / targetValue) * 100), 100);

  useEffect(() => {
    if (goal && open) {
      setCurrentValue(goal.current_value || 0);
    }
  }, [goal, open]);

  const handleSubmit = async () => {
    await updateGoal.mutateAsync({
      id: goal.id,
      current_value: currentValue,
    });
    onOpenChange(false);
  };

  const increment = () => {
    const step = targetValue >= 100 ? 10 : 1;
    setCurrentValue(Math.min(currentValue + step, targetValue));
  };

  const decrement = () => {
    const step = targetValue >= 100 ? 10 : 1;
    setCurrentValue(Math.max(currentValue - step, 0));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Update Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Goal title */}
          <p className="text-sm text-muted-foreground text-center">{goal.title}</p>

          {/* Big progress display */}
          <div className="text-center">
            <span className="text-5xl font-bold text-primary">{progress}%</span>
          </div>

          {/* Slider */}
          <Slider
            value={[currentValue]}
            onValueChange={([val]) => setCurrentValue(val)}
            max={targetValue}
            step={1}
            className="w-full"
          />

          {/* Value controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={decrement}
              disabled={currentValue <= 0}
            >
              <Minus className="w-5 h-5" />
            </Button>

            <div className="flex items-baseline gap-1">
              <Input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(Math.max(0, Math.min(parseFloat(e.target.value) || 0, targetValue)))}
                className="w-20 text-center text-lg font-semibold"
              />
              <span className="text-muted-foreground">/ {targetValue}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={increment}
              disabled={currentValue >= targetValue}
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={updateGoal.isPending}
          >
            {updateGoal.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
