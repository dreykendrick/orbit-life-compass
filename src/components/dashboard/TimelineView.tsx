import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Check, Clock, AlertCircle, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRoutines } from "@/hooks/useRoutines";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddRoutineDialog } from "@/components/routines/AddRoutineDialog";

const formatTime = (time: string) => time.slice(0, 5);

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const TimelineView = () => {
  const isMobile = useIsMobile();
  const { data: routines, isLoading } = useRoutines();

  // Filter to active routines and sort by start time
  const todayRoutines = routines
    ?.filter(r => r.is_active)
    ?.sort((a, b) => a.start_time.localeCompare(b.start_time)) || [];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Today's Timeline</h2>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {!isMobile && todayRoutines.length > 0 && (
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
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="w-3 h-3 rounded-full mt-4" />
              <Skeleton className="flex-1 h-20 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && todayRoutines.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">No routines scheduled</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create routines to see them in your timeline
          </p>
          <AddRoutineDialog>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Routine
            </Button>
          </AddRoutineDialog>
        </div>
      )}

      {/* Timeline */}
      {!isLoading && todayRoutines.length > 0 && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] md:left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/50 via-border to-border" />

          <div className="space-y-3 md:space-y-4">
            {todayRoutines.map((routine, index) => {
              // Determine status based on current time
              const now = new Date();
              const [hours, minutes] = routine.start_time.split(':').map(Number);
              const routineTime = new Date();
              routineTime.setHours(hours, minutes, 0);
              
              const endTime = new Date(routineTime.getTime() + routine.duration_minutes * 60000);
              
              let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
              if (now > endTime) {
                status = 'completed';
              } else if (now >= routineTime && now <= endTime) {
                status = 'current';
              }

              const styles = {
                completed: {
                  dot: "bg-success",
                  card: "border-success/20 bg-success/5",
                  icon: <Check className="w-4 h-4 text-success" />,
                },
                current: {
                  dot: "bg-primary animate-pulse",
                  card: "border-primary/30 bg-primary/5",
                  icon: <Clock className="w-4 h-4 text-primary" />,
                },
                upcoming: {
                  dot: "bg-muted-foreground/40",
                  card: "border-border bg-card hover:border-primary/20",
                  icon: null,
                },
              }[status];
              
              return (
                <motion.div
                  key={routine.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-3 md:gap-4"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 mt-3 md:mt-4">
                    <div className={cn(
                      "w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300",
                      styles.dot
                    )} />
                  </div>

                  {/* Task card */}
                  <div className={cn(
                    "flex-1 p-3 md:p-4 rounded-xl border transition-all duration-200 active:scale-[0.98]",
                    styles.card
                  )}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                          <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {formatTime(routine.start_time)}
                          </span>
                          <span className="text-[10px] md:text-xs text-muted-foreground">•</span>
                          <span className="text-[10px] md:text-xs text-muted-foreground">
                            {formatDuration(routine.duration_minutes)}
                          </span>
                        </div>
                        <h3 className={cn(
                          "font-semibold text-sm md:text-base truncate",
                          status === "completed" && "text-muted-foreground line-through"
                        )}>
                          {routine.title}
                        </h3>
                        <span className="inline-block mt-1.5 md:mt-2 text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-md bg-secondary text-secondary-foreground capitalize">
                          {routine.frequency}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {styles.icon && (
                          <div className="p-1.5 md:p-2 rounded-lg bg-background/50">
                            {styles.icon}
                          </div>
                        )}
                        {isMobile && (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
