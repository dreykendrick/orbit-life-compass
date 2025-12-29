import { motion } from "framer-motion";
import { TrendingUp, Flame, Target, Zap, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRoutines } from "@/hooks/useRoutines";
import { useGoals } from "@/hooks/useGoals";
import { Skeleton } from "@/components/ui/skeleton";

const colorClasses = {
  primary: "text-primary bg-primary/10",
  warning: "text-warning bg-warning/10",
  success: "text-success bg-success/10",
  accent: "text-accent bg-accent/10",
};

export const StatsCards = () => {
  const isMobile = useIsMobile();
  const { data: routines, isLoading: routinesLoading } = useRoutines();
  const { data: goals, isLoading: goalsLoading } = useGoals();

  const isLoading = routinesLoading || goalsLoading;

  // Calculate real stats
  const activeRoutines = routines?.filter(r => r.is_active)?.length || 0;
  const totalRoutines = routines?.length || 0;
  const activeGoals = goals?.filter(g => g.is_active)?.length || 0;
  
  // Calculate average goal progress
  const avgProgress = goals?.length 
    ? Math.round(goals.reduce((acc, g) => {
        if (!g.target_value) return acc;
        return acc + Math.min(((g.current_value || 0) / g.target_value) * 100, 100);
      }, 0) / goals.filter(g => g.target_value).length) || 0
    : 0;

  // Build stats dynamically - only show relevant cards
  const stats = [];

  // Always show Active Routines if there are any
  if (totalRoutines > 0) {
    stats.push({
      label: "Active Routines",
      value: activeRoutines.toString(),
      subtext: `of ${totalRoutines}`,
      icon: Clock,
      color: "primary",
    });
  }

  // Always show Active Goals if there are any
  if (goals?.length) {
    stats.push({
      label: "Active Goals",
      value: activeGoals.toString(),
      subtext: "tracking",
      icon: Target,
      color: "warning",
    });
  }

  // Only show Avg Progress if there are goals with target values
  const goalsWithTargets = goals?.filter(g => g.target_value) || [];
  if (goalsWithTargets.length > 0) {
    stats.push({
      label: "Avg Progress",
      value: `${avgProgress}%`,
      subtext: "on goals",
      icon: TrendingUp,
      color: "success",
    });
  }

  // Only show Keep Going if there are active routines or goals
  if (activeRoutines > 0 || activeGoals > 0) {
    stats.push({
      label: "Keep Going",
      value: "💪",
      subtext: "You got this!",
      icon: Zap,
      color: "accent",
    });
  }

  // If no data at all, don't render anything
  if (stats.length === 0) {
    return null;
  }

  if (isLoading) {
    if (isMobile) {
      return (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shrink-0 w-36">
              <Card variant="interactive">
                <CardContent className="p-4">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <Skeleton className="h-6 w-16 mt-3" />
                  <Skeleton className="h-3 w-12 mt-2" />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} variant="interactive">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="w-12 h-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="shrink-0 w-36"
            >
              <Card variant="interactive" className="overflow-hidden">
                <CardContent className="p-4">
                  <div className={`p-2 rounded-lg w-fit ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="mt-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{stat.value}</span>
                      <span className="text-xs text-muted-foreground">{stat.subtext}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="interactive" className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-3xl font-bold">{stat.value}</span>
                      <span className="text-sm text-muted-foreground">{stat.subtext}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
