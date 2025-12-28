import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, CheckCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateRoutine } from "@/hooks/useRoutines";
import { useIsMobile } from "@/hooks/use-mobile";

interface SuggestedTask {
  title: string;
  time: string;
  duration: number;
}

interface AIPlanDialogProps {
  children?: React.ReactNode;
}

export const AIPlanDialog = ({ children }: AIPlanDialogProps) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const [addedTasks, setAddedTasks] = useState<Set<number>>(new Set());
  
  const isMobile = useIsMobile();
  const createRoutine = useCreateRoutine();

  const generatePlan = async () => {
    if (!input.trim()) {
      toast.error("Please describe your day or goals");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with smart defaults based on input
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const inputLower = input.toLowerCase();
    const generatedTasks: SuggestedTask[] = [];

    // Generate contextual suggestions based on input
    if (inputLower.includes("productive") || inputLower.includes("work")) {
      generatedTasks.push(
        { title: "Deep work session", time: "09:00", duration: 90 },
        { title: "Email & communication", time: "11:00", duration: 30 },
        { title: "Project review", time: "14:00", duration: 60 }
      );
    }
    
    if (inputLower.includes("healthy") || inputLower.includes("fitness") || inputLower.includes("exercise")) {
      generatedTasks.push(
        { title: "Morning workout", time: "07:00", duration: 45 },
        { title: "Healthy meal prep", time: "12:00", duration: 30 }
      );
    }
    
    if (inputLower.includes("learn") || inputLower.includes("study") || inputLower.includes("read")) {
      generatedTasks.push(
        { title: "Learning session", time: "10:00", duration: 45 },
        { title: "Reading time", time: "20:00", duration: 30 }
      );
    }
    
    if (inputLower.includes("relax") || inputLower.includes("mindful") || inputLower.includes("meditation")) {
      generatedTasks.push(
        { title: "Morning meditation", time: "06:30", duration: 15 },
        { title: "Evening wind-down", time: "21:00", duration: 30 }
      );
    }

    // Default suggestions if no specific keywords
    if (generatedTasks.length === 0) {
      generatedTasks.push(
        { title: "Morning planning", time: "08:00", duration: 15 },
        { title: "Focus time", time: "09:00", duration: 60 },
        { title: "Break & refresh", time: "12:00", duration: 30 },
        { title: "Afternoon tasks", time: "14:00", duration: 90 },
        { title: "Daily review", time: "17:00", duration: 15 }
      );
    }

    setSuggestions(generatedTasks);
    setAddedTasks(new Set());
    setIsGenerating(false);
  };

  const addTask = async (task: SuggestedTask, index: number) => {
    await createRoutine.mutateAsync({
      title: task.title,
      description: `Generated from AI plan: "${input.slice(0, 50)}..."`,
      start_time: task.time,
      duration_minutes: task.duration,
      frequency: "daily",
      custom_days: null,
      is_active: true,
      alarm_enabled: false,
    });
    
    setAddedTasks(prev => new Set([...prev, index]));
    toast.success(`Added "${task.title}" to your routine`);
  };

  const addAllTasks = async () => {
    for (let i = 0; i < suggestions.length; i++) {
      if (!addedTasks.has(i)) {
        await addTask(suggestions[i], i);
      }
    }
  };

  const resetDialog = () => {
    setInput("");
    setSuggestions([]);
    setAddedTasks(new Set());
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetDialog();
    }}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="glass" size={isMobile ? "default" : "lg"} className="gap-2 shrink-0">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            AI Plan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Day Planner
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                Describe your goals for today and I'll create a personalized schedule for you.
              </p>
              
              <Textarea
                placeholder="e.g., I want to be productive at work, stay healthy, and have time to relax..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
              />
              
              <Button 
                onClick={generatePlan} 
                disabled={isGenerating || !input.trim()}
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate My Plan
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Here's your personalized plan. Click to add tasks to your schedule.
              </p>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {suggestions.map((task, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.time} • {task.duration} min
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={addedTasks.has(index) ? "ghost" : "outline"}
                      onClick={() => addTask(task, index)}
                      disabled={addedTasks.has(index) || createRoutine.isPending}
                    >
                      {addedTasks.has(index) ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={resetDialog}
                >
                  Start Over
                </Button>
                <Button 
                  className="flex-1"
                  onClick={addAllTasks}
                  disabled={addedTasks.size === suggestions.length || createRoutine.isPending}
                >
                  Add All
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
