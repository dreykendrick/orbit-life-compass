import { motion } from "framer-motion";
import { Clock, Edit2, Trash2, Bell, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRoutines, useDeleteRoutine } from "@/hooks/useRoutines";
import { AddRoutineDialog } from "./AddRoutineDialog";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors: Record<string, string> = {
  wellness: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  fitness: "bg-success/10 text-success border-success/20",
  learning: "bg-accent/10 text-accent border-accent/20",
  work: "bg-warning/10 text-warning border-warning/20",
  finance: "bg-primary/10 text-primary border-primary/20",
  health: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  personal: "bg-secondary text-secondary-foreground border-border",
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const formatTime = (time: string) => {
  return time.slice(0, 5);
};

export const RoutinesView = () => {
  const isMobile = useIsMobile();
  const { data: routines, isLoading } = useRoutines();
  const deleteRoutine = useDeleteRoutine();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this routine?")) {
      await deleteRoutine.mutateAsync(id);
    }
  };

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
        <AddRoutineDialog />
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="interactive">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!routines || routines.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No routines yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Create your first routine to start building better habits and track your daily progress.
          </p>
          <AddRoutineDialog>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Routine
            </Button>
          </AddRoutineDialog>
        </motion.div>
      )}

      {/* Routines List */}
      {!isLoading && routines && routines.length > 0 && (
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
                    !routine.is_active && "opacity-60"
                  )}
                >
                  <CardContent className="p-3 md:p-5">
                    <div className="flex items-center gap-3 md:gap-4">
                      {/* Time indicator */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-secondary flex items-center justify-center">
                          <span className="text-xs md:text-sm font-bold">
                            {formatTime(routine.start_time).split(":")[0]}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm md:text-base truncate">{routine.title}</h3>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                              <span>{formatDuration(routine.duration_minutes)}</span>
                              <span>•</span>
                              <span className="capitalize">{routine.frequency}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            {isMobile && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className={cn(
                            "text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-md border capitalize",
                            categoryColors[routine.frequency] || categoryColors.personal
                          )}>
                            {routine.frequency}
                          </span>
                          
                          {!isMobile && (
                            <div className="flex items-center gap-1">
                              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                                <Bell className={cn(
                                  "w-4 h-4",
                                  routine.alarm_enabled ? "text-primary" : "text-muted-foreground"
                                )} />
                              </button>
                              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                                <Edit2 className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button 
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                onClick={() => handleDelete(routine.id)}
                              >
                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                              </button>
                            </div>
                          )}

                          {isMobile && (
                            <button 
                              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                              onClick={() => handleDelete(routine.id)}
                            >
                              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                            </button>
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
      )}
    </div>
  );
};
