import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface GoalFormFieldsProps {
  category: string;
  description: string;
  setDescription: (value: string) => void;
  targetValue: string;
  setTargetValue: (value: string) => void;
  currentValue: string;
  setCurrentValue: (value: string) => void;
  targetDate: string;
  setTargetDate: (value: string) => void;
  dailyAction: string;
  setDailyAction: (value: string) => void;
}

const categoryConfig: Record<string, {
  descriptionPlaceholder: string;
  targetLabel: string;
  targetPlaceholder: string;
  currentLabel: string;
  currentPlaceholder: string;
  dailyActionLabel: string;
  dailyActionPlaceholder: string;
  targetUnit?: string;
}> = {
  finance: {
    descriptionPlaceholder: "What financial goal do you want to achieve?",
    targetLabel: "Target Amount",
    targetPlaceholder: "e.g., 5000",
    currentLabel: "Current Savings",
    currentPlaceholder: "0",
    dailyActionLabel: "Daily Saving Goal",
    dailyActionPlaceholder: "e.g., Save $20/day",
    targetUnit: "$",
  },
  fitness: {
    descriptionPlaceholder: "What fitness milestone do you want to reach?",
    targetLabel: "Target (reps/kg/km)",
    targetPlaceholder: "e.g., 100 pushups, 80kg, 10km",
    currentLabel: "Current Level",
    currentPlaceholder: "e.g., 20",
    dailyActionLabel: "Daily Workout",
    dailyActionPlaceholder: "e.g., 30 mins cardio, 50 pushups",
  },
  learning: {
    descriptionPlaceholder: "What skill or knowledge do you want to acquire?",
    targetLabel: "Target Hours/Courses",
    targetPlaceholder: "e.g., 100 hours, 5 courses",
    currentLabel: "Hours/Courses Completed",
    currentPlaceholder: "0",
    dailyActionLabel: "Daily Study Time",
    dailyActionPlaceholder: "e.g., Study 1 hour, Read 20 pages",
  },
  health: {
    descriptionPlaceholder: "What health improvement do you want to achieve?",
    targetLabel: "Target (weight/days)",
    targetPlaceholder: "e.g., 70kg, 30 days streak",
    currentLabel: "Current Status",
    currentPlaceholder: "e.g., 85",
    dailyActionLabel: "Daily Health Habit",
    dailyActionPlaceholder: "e.g., Drink 8 glasses water, Sleep 8 hours",
  },
  career: {
    descriptionPlaceholder: "What career milestone do you want to achieve?",
    targetLabel: "Target Milestone",
    targetPlaceholder: "e.g., 10 projects, 5 certifications",
    currentLabel: "Current Progress",
    currentPlaceholder: "0",
    dailyActionLabel: "Daily Career Action",
    dailyActionPlaceholder: "e.g., Apply to 2 jobs, Network 30 mins",
  },
  personal: {
    descriptionPlaceholder: "What personal goal do you want to accomplish?",
    targetLabel: "Target Milestone",
    targetPlaceholder: "e.g., 50 books, 12 trips",
    currentLabel: "Current Progress",
    currentPlaceholder: "0",
    dailyActionLabel: "Daily Habit",
    dailyActionPlaceholder: "e.g., Read 30 mins, Meditate 10 mins",
  },
};

export const GoalFormFields = ({
  category,
  description,
  setDescription,
  targetValue,
  setTargetValue,
  currentValue,
  setCurrentValue,
  targetDate,
  setTargetDate,
  dailyAction,
  setDailyAction,
}: GoalFormFieldsProps) => {
  const config = categoryConfig[category] || categoryConfig.personal;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          placeholder={config.descriptionPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentValue">{config.currentLabel}</Label>
          <Input
            id="currentValue"
            type="number"
            min="0"
            step="0.01"
            placeholder={config.currentPlaceholder}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetValue">{config.targetLabel}</Label>
          <Input
            id="targetValue"
            type="number"
            min="0"
            step="0.01"
            placeholder={config.targetPlaceholder}
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
        <Label htmlFor="dailyAction">{config.dailyActionLabel} (optional)</Label>
        <Input
          id="dailyAction"
          placeholder={config.dailyActionPlaceholder}
          value={dailyAction}
          onChange={(e) => setDailyAction(e.target.value)}
        />
      </div>
    </>
  );
};
