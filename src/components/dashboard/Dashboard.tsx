import { motion } from "framer-motion";
import { StatsCards } from "./StatsCards";
import { TimelineView } from "./TimelineView";
import { ProjectionCard } from "./ProjectionCard";
import { QuickActions } from "./QuickActions";

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">
          Good morning, <span className="text-gradient">Alex</span>
        </h1>
        <p className="text-muted-foreground">
          You're doing great. 3 tasks completed, 2 remaining today.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Overview */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimelineView />
        </div>
        <div>
          <ProjectionCard />
        </div>
      </div>
    </div>
  );
};
