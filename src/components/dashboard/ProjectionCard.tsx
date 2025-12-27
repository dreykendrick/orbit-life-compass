import { forwardRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Sparkles, ChevronRight, Target, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGoals } from "@/hooks/useGoals";
import { Skeleton } from "@/components/ui/skeleton";
import { AddGoalDialog } from "@/components/goals/AddGoalDialog";
import { format, differenceInDays } from "date-fns";

export const ProjectionCard = () => {
  const isMobile = useIsMobile();
  const { data: goals, isLoading } = useGoals();

  // Get goals with target dates and calculate progress
  const goalsWithProjections = goals
    ?.filter(g => g.is_active && g.target_value && g.target_date)
    ?.map(g => {
      const progress = Math.min(Math.round(((g.current_value || 0) / (g.target_value || 1)) * 100), 100);
      const daysRemaining = differenceInDays(new Date(g.target_date!), new Date());
      return {
        ...g,
        progress,
        daysRemaining: Math.max(0, daysRemaining),
      };
    })
    ?.slice(0, 3) || [];

  return (
    <Card variant="default" className="overflow-hidden">
      <CardHeader className="pb-3 md:pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base md:text-xl">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            Projections
          </CardTitle>
          <span className="text-[10px] md:text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
            Goal tracking
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && goalsWithProjections.length === 0 && (
          <div className="text-center py-6">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-sm mb-1">No projections yet</h3>
            <p className="text-muted-foreground text-xs mb-4">
              Add goals with target dates to see projections
            </p>
            <AddGoalDialog>
              <Button size="sm" variant="outline" className="gap-2">
                <Plus className="w-3 h-3" />
                Add Goal
              </Button>
            </AddGoalDialog>
          </div>
        )}

        {/* Projections List */}
        {!isLoading && goalsWithProjections.length > 0 && (
          <>
            {goalsWithProjections.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="space-y-2 md:space-y-3 active:bg-secondary/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base truncate">{goal.title}</h3>
                    {goal.daily_action && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{goal.daily_action}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-primary">
                        <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="font-bold text-sm md:text-base">{goal.progress}%</span>
                      </div>
                    </div>
                    {isMobile && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-1.5 md:h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.15 }}
                    className="absolute left-0 top-0 h-full bg-primary rounded-full"
                  />
                </div>

                {/* Projected completion */}
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span>Target: {format(new Date(goal.target_date!), 'MMM d, yyyy')}</span>
                  </div>
                  <span className="text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 md:px-2 py-0.5 md:py-1 rounded-md font-medium">
                    {goal.daysRemaining}d left
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Motivational footer */}
            <div className="pt-3 md:pt-4 border-t border-border">
              <p className="text-xs md:text-sm text-muted-foreground text-center">
                <span className="text-primary font-medium">Keep going</span> — you're making progress!
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
