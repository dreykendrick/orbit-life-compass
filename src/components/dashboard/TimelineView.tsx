import { motion } from "framer-motion";
import { Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  name: string;
  time: string;
  duration: string;
  status: "completed" | "current" | "upcoming" | "missed";
  category: string;
}

const tasks: Task[] = [
  { id: "1", name: "Morning meditation", time: "06:00", duration: "15 min", status: "completed", category: "Wellness" },
  { id: "2", name: "Workout session", time: "06:30", duration: "45 min", status: "completed", category: "Fitness" },
  { id: "3", name: "French practice", time: "08:00", duration: "30 min", status: "current", category: "Learning" },
  { id: "4", name: "Deep work block", time: "09:00", duration: "2 hrs", status: "upcoming", category: "Work" },
  { id: "5", name: "Review finances", time: "12:00", duration: "20 min", status: "upcoming", category: "Finance" },
  { id: "6", name: "Reading session", time: "20:00", duration: "30 min", status: "upcoming", category: "Learning" },
];

const getStatusStyles = (status: Task["status"]) => {
  switch (status) {
    case "completed":
      return {
        dot: "bg-success shadow-[0_0_12px_hsl(var(--success)/0.5)]",
        line: "bg-success/30",
        card: "border-success/30 bg-success/5",
        icon: <Check className="w-4 h-4 text-success" />,
      };
    case "current":
      return {
        dot: "bg-primary shadow-glow animate-pulse-glow",
        line: "bg-primary/30",
        card: "border-primary/40 bg-primary/10 shadow-glow",
        icon: <Clock className="w-4 h-4 text-primary" />,
      };
    case "missed":
      return {
        dot: "bg-destructive shadow-[0_0_12px_hsl(var(--destructive)/0.5)]",
        line: "bg-destructive/30",
        card: "border-destructive/30 bg-destructive/5",
        icon: <AlertCircle className="w-4 h-4 text-destructive" />,
      };
    default:
      return {
        dot: "bg-muted-foreground/40",
        line: "bg-border",
        card: "border-border bg-card hover:border-primary/20",
        icon: null,
      };
  }
};

export const TimelineView = () => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Today's Timeline</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Current</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-border to-border" />

        <div className="space-y-4">
          {tasks.map((task, index) => {
            const styles = getStatusStyles(task.status);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline dot */}
                <div className="relative z-10 mt-4">
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    styles.dot
                  )} />
                </div>

                {/* Task card */}
                <div className={cn(
                  "flex-1 p-4 rounded-xl border transition-all duration-300",
                  styles.card
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {task.time}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{task.duration}</span>
                      </div>
                      <h3 className={cn(
                        "font-semibold",
                        task.status === "completed" && "text-muted-foreground line-through"
                      )}>
                        {task.name}
                      </h3>
                      <span className="inline-block mt-2 text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                        {task.category}
                      </span>
                    </div>
                    
                    {styles.icon && (
                      <div className="p-2 rounded-lg bg-background/50">
                        {styles.icon}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
