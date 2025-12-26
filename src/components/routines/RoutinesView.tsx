import { motion } from "framer-motion";
import { Clock, Plus, Edit2, Trash2, Calendar, Repeat, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Routine {
  id: string;
  name: string;
  time: string;
  duration: string;
  frequency: string;
  category: string;
  isActive: boolean;
  streak: number;
}

const routines: Routine[] = [
  { id: "1", name: "Morning Meditation", time: "06:00", duration: "15 min", frequency: "Daily", category: "Wellness", isActive: true, streak: 12 },
  { id: "2", name: "Workout Session", time: "06:30", duration: "45 min", frequency: "Daily", category: "Fitness", isActive: true, streak: 7 },
  { id: "3", name: "French Practice", time: "08:00", duration: "30 min", frequency: "Daily", category: "Learning", isActive: true, streak: 21 },
  { id: "4", name: "Deep Work Block", time: "09:00", duration: "2 hrs", frequency: "Weekdays", category: "Work", isActive: true, streak: 5 },
  { id: "5", name: "Review Finances", time: "12:00", duration: "20 min", frequency: "Weekly", category: "Finance", isActive: true, streak: 4 },
  { id: "6", name: "Evening Reading", time: "20:00", duration: "30 min", frequency: "Daily", category: "Learning", isActive: false, streak: 0 },
];

const categoryColors: Record<string, string> = {
  Wellness: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Fitness: "bg-success/10 text-success border-success/30",
  Learning: "bg-accent/10 text-accent border-accent/30",
  Work: "bg-warning/10 text-warning border-warning/30",
  Finance: "bg-primary/10 text-primary border-primary/30",
};

export const RoutinesView = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary" />
            Routines
          </h1>
          <p className="text-muted-foreground mt-2">
            Build lasting habits with consistent daily routines.
          </p>
        </div>
        <Button variant="glow" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Routine
        </Button>
      </motion.div>

      {/* Weekly Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="glass">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                const isToday = i === 3; // Thursday
                const isPast = i < 3;
                const completion = isPast ? Math.floor(Math.random() * 30) + 70 : isToday ? 67 : 0;
                
                return (
                  <div
                    key={day}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-xl transition-all",
                      isToday && "bg-primary/10 border border-primary/30"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-medium",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}>
                      {day}
                    </span>
                    <div className="relative w-10 h-10 mt-2">
                      <svg className="w-10 h-10 -rotate-90">
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          className="fill-none stroke-secondary"
                          strokeWidth="3"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          className={cn(
                            "fill-none stroke-current transition-all",
                            isToday ? "text-primary" : isPast ? "text-success" : "text-muted"
                          )}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={`${(completion / 100) * 100.53} 100.53`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {completion > 0 ? `${completion}%` : "-"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Routines List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Routines</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {routines.map((routine, index) => (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card 
                variant="interactive" 
                className={cn(
                  "overflow-hidden",
                  !routine.isActive && "opacity-60"
                )}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Time indicator */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <span className="text-sm font-bold">{routine.time.split(":")[0]}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1">{routine.time}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{routine.name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {routine.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Repeat className="w-3.5 h-3.5" />
                              {routine.frequency}
                            </span>
                          </div>
                        </div>
                        
                        {routine.streak > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-warning/10 text-warning text-sm">
                            <span className="text-xs">🔥</span>
                            <span className="font-bold">{routine.streak}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-md border",
                          categoryColors[routine.category]
                        )}>
                          {routine.category}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
