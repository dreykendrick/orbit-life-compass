import { motion } from "framer-motion";
import { StatsCards } from "./StatsCards";
import { TimelineView } from "./TimelineView";
import { ProjectionCard } from "./ProjectionCard";
import { QuickActions } from "./QuickActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

export const Dashboard = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "there";
  const greeting = getGreeting();

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
          You're doing great. 3 tasks completed, 2 remaining today.
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
