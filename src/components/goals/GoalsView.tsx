import { motion } from "framer-motion";
import { Target, TrendingUp, Calendar, Plus, Sparkles, DollarSign, BookOpen, Dumbbell, ChevronRight, Heart, Briefcase, User, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGoals, useDeleteGoal } from "@/hooks/useGoals";
import { AddGoalDialog } from "./AddGoalDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const categoryIcons: Record<string, typeof Target> = {
  finance: DollarSign,
  fitness: Dumbbell,
  learning: BookOpen,
  health: Heart,
  career: Briefcase,
  personal: User,
};

const categoryColors: Record<string, { bg: string; text: string; progress: string }> = {
  finance: { bg: "bg-primary/10", text: "text-primary", progress: "bg-primary" },
  fitness: { bg: "bg-success/10", text: "text-success", progress: "bg-success" },
  learning: { bg: "bg-accent/10", text: "text-accent", progress: "bg-accent" },
  health: { bg: "bg-pink-500/10", text: "text-pink-500", progress: "bg-pink-500" },
  career: { bg: "bg-warning/10", text: "text-warning", progress: "bg-warning" },
  personal: { bg: "bg-purple-500/10", text: "text-purple-500", progress: "bg-purple-500" },
};

export const GoalsView = () => {
  const isMobile = useIsMobile();
  const { data: goals, isLoading } = useGoals();
  const deleteGoal = useDeleteGoal();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      await deleteGoal.mutateAsync(id);
    }
  };

  const calculateProgress = (current: number | null, target: number | null) => {
    if (!target || target === 0) return 0;
    const current_val = current || 0;
    return Math.min(Math.round((current_val / target) * 100), 100);
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
            <Target className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
            <span className="truncate">Goals</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 md:mt-2 line-clamp-2">
            Track your objectives and see where your daily actions lead.
          </p>
        </div>
        <AddGoalDialog />
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="interactive">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-2 w-full mt-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!goals || goals.length === 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Set your first goal to start tracking your progress and achieving your dreams.
          </p>
          <AddGoalDialog>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Goal
            </Button>
          </AddGoalDialog>
        </motion.div>
      )}

      {/* Goals List */}
      {!isLoading && goals && goals.length > 0 && (
        <>
          {/* AI Insight Banner - only show when there are goals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glow" className="overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-3 rounded-xl bg-primary/10 shrink-0">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base">Your Progress</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      You have <span className="text-primary font-medium">{goals.length} active goal{goals.length !== 1 ? 's' : ''}</span>. Keep tracking your progress daily!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-3 md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-6 md:space-y-0">
            {goals.map((goal, index) => {
              const Icon = categoryIcons[goal.category.toLowerCase()] || Target;
              const colors = categoryColors[goal.category.toLowerCase()] || categoryColors.personal;
              const progress = calculateProgress(goal.current_value, goal.target_value);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Card variant="interactive" className="h-full active:scale-[0.98] transition-transform group">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`p-2.5 md:p-3 rounded-xl ${colors.bg} shrink-0`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm md:text-base truncate">{goal.title}</h3>
                              {goal.daily_action && (
                                <p className="text-xs text-muted-foreground">{goal.daily_action}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`font-bold text-sm md:text-base ${colors.text}`}>{progress}%</span>
                              {isMobile && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="h-1.5 md:h-2 bg-secondary rounded-full overflow-hidden mt-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                              className={`h-full ${colors.progress} rounded-full`}
                            />
                          </div>

                          {/* Stats */}
                          {!isMobile && goal.target_value && (
                            <>
                              <div className="grid grid-cols-2 gap-4 py-3 mt-3 border-t border-border">
                                <div>
                                  <p className="text-xs text-muted-foreground">Current</p>
                                  <p className="font-semibold text-sm">{goal.current_value || 0}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Target</p>
                                  <p className="font-semibold text-sm">{goal.target_value}</p>
                                </div>
                              </div>

                              {goal.target_date && (
                                <div className="flex items-center gap-2 text-sm mt-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    Target: {format(new Date(goal.target_date), 'MMM d, yyyy')}
                                  </span>
                                </div>
                              )}
                            </>
                          )}

                          {isMobile && goal.target_value && (
                            <div className="flex items-center justify-between mt-3 text-xs">
                              <span className="text-muted-foreground">
                                {goal.current_value || 0} → {goal.target_value}
                              </span>
                              {goal.target_date && (
                                <span className={`${colors.text} font-medium`}>
                                  {format(new Date(goal.target_date), 'MMM d')}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Delete button for mobile */}
                          {isMobile && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive mt-2 -ml-2"
                              onClick={() => handleDelete(goal.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          )}

                          {/* Delete button on hover (desktop) */}
                          {!isMobile && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(goal.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
