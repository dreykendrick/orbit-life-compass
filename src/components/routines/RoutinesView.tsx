import { motion } from "framer-motion";
import { Clock, Plus, Edit2, Trash2, Repeat, Bell, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  Wellness: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Fitness: "bg-success/10 text-success border-success/20",
  Learning: "bg-accent/10 text-accent border-accent/20",
  Work: "bg-warning/10 text-warning border-warning/20",
  Finance: "bg-primary/10 text-primary border-primary/20",
};

export const RoutinesView = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
            <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
            <span>Routines</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 md:mt-2">
            Build lasting habits with consistent daily routines.
          </p>
        </div>
        <Button variant="default" size={isMobile ? "sm" : "default"} className="gap-1 md:gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          {!isMobile && "Add Routine"}
        </Button>
      </motion.div>

      {/* Weekly Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="glass">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="text-base md:text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                const fullDay = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i];
                const isToday = i === 3;
                const isPast = i < 3;
                const completion = isPast ? Math.floor(Math.random() * 30) + 70 : isToday ? 67 : 0;
                
                return (
                  <div
                    key={fullDay}
                    className={cn(
                      "flex flex-col items-center p-2 md:p-3 rounded-lg md:rounded-xl transition-all",
                      isToday && "bg-primary/10 border border-primary/20"
                    )}
                  >
                    <span className={cn(
                      "text-[10px] md:text-xs font-medium",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}>
                      {isMobile ? day : fullDay}
                    </span>
                    <div className="relative w-8 h-8 md:w-10 md:h-10 mt-1 md:mt-2">
                      <svg className="w-8 h-8 md:w-10 md:h-10 -rotate-90">
                        <circle
                          cx={isMobile ? "16" : "20"}
                          cy={isMobile ? "16" : "20"}
                          r={isMobile ? "12" : "16"}
                          className="fill-none stroke-secondary"
                          strokeWidth={isMobile ? "2" : "3"}
                        />
                        <circle
                          cx={isMobile ? "16" : "20"}
                          cy={isMobile ? "16" : "20"}
                          r={isMobile ? "12" : "16"}
                          className={cn(
                            "fill-none stroke-current transition-all",
                            isToday ? "text-primary" : isPast ? "text-success" : "text-muted"
                          )}
                          strokeWidth={isMobile ? "2" : "3"}
                          strokeLinecap="round"
                          strokeDasharray={`${(completion / 100) * (isMobile ? 75.4 : 100.53)} ${isMobile ? 75.4 : 100.53}`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] md:text-xs font-bold">
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
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-lg md:text-xl font-semibold">Your Routines</h2>
        <div className="space-y-2 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
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
                  "overflow-hidden active:scale-[0.98] transition-transform",
                  !routine.isActive && "opacity-60"
                )}
              >
                <CardContent className="p-3 md:p-5">
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Time indicator */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-secondary flex items-center justify-center">
                        <span className="text-xs md:text-sm font-bold">{routine.time.split(":")[0]}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm md:text-base truncate">{routine.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <span>{routine.duration}</span>
                            <span>•</span>
                            <span>{routine.frequency}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          {routine.streak > 0 && (
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-warning/10 text-warning text-xs">
                              <span>🔥</span>
                              <span className="font-bold">{routine.streak}</span>
                            </div>
                          )}
                          {isMobile && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className={cn(
                          "text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-md border",
                          categoryColors[routine.category]
                        )}>
                          {routine.category}
                        </span>
                        
                        {!isMobile && (
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
                        )}
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
