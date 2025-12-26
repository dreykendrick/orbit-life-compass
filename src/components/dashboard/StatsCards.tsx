import { motion } from "framer-motion";
import { TrendingUp, Flame, Target, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Tasks Today",
    value: "4/6",
    subtext: "2 remaining",
    icon: Target,
    color: "primary",
    trend: "+12%",
  },
  {
    label: "Current Streak",
    value: "7",
    subtext: "days",
    icon: Flame,
    color: "warning",
    trend: "Personal best!",
  },
  {
    label: "Consistency",
    value: "89%",
    subtext: "this week",
    icon: TrendingUp,
    color: "success",
    trend: "+5%",
  },
  {
    label: "Focus Time",
    value: "4.2h",
    subtext: "today",
    icon: Zap,
    color: "accent",
    trend: "On track",
  },
];

const colorClasses = {
  primary: "text-primary bg-primary/10",
  warning: "text-warning bg-warning/10",
  success: "text-success bg-success/10",
  accent: "text-accent bg-accent/10",
};

export const StatsCards = () => {
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
                    <p className="text-xs text-success mt-2 font-medium">{stat.trend}</p>
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
