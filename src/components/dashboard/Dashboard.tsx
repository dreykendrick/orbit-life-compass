import { motion } from "framer-motion";
import { StatsCards } from "./StatsCards";
import { TimelineView } from "./TimelineView";
import { ProjectionCard } from "./ProjectionCard";
import { QuickActions } from "./QuickActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useRoutines } from "@/hooks/useRoutines";
import { useTodayStats } from "@/hooks/useTaskCompletions";

export const Dashboard = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: routines } = useRoutines();
  const { data: todayCompletions } = useTodayStats();

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "there";
  const greeting = getGreeting();

  // Calculate today's task stats
  const activeRoutines = routines?.filter(r => r.is_active) || [];
  const completedToday = todayCompletions?.length || 0;
  const remainingToday = Math.max(0, activeRoutines.length - completedToday);

  const getSubtitle = () => {
    if (activeRoutines.length === 0) {
      return "Add some routines to get started with your day!";
    }
    if (completedToday === 0 && remainingToday > 0) {
      return `You have ${remainingToday} task${remainingToday !== 1 ? 's' : ''} to complete today.`;
    }
    if (remainingToday === 0 && completedToday > 0) {
      return `Amazing! All ${completedToday} tasks completed today! 🎉`;
    }
    return `You're doing great. ${completedToday} task${completedToday !== 1 ? 's' : ''} completed, ${remainingToday} remaining today.`;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-2xl md:text-3xl font-bold">
          {greeting}, <span className="text-gradient">{displayName}</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {getSubtitle()}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Overview */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <TimelineView />
        </div>
        <div className="order-1 lg:order-2">
          <ProjectionCard />
        </div>
      </div>
    </div>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
