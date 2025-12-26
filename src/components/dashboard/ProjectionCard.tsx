import { motion } from "framer-motion";
import { TrendingUp, Calendar, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Projection {
  goal: string;
  currentProgress: number;
  projectedDate: string;
  daysRemaining: number;
  dailyAction: string;
}

const projections: Projection[] = [
  {
    goal: "Save $5,000",
    currentProgress: 68,
    projectedDate: "March 15, 2025",
    daysRemaining: 78,
    dailyAction: "Saving $21/day",
  },
  {
    goal: "Learn French (B1)",
    currentProgress: 42,
    projectedDate: "June 20, 2025",
    daysRemaining: 176,
    dailyAction: "30 min/day",
  },
];

export const ProjectionCard = () => {
  return (
    <Card variant="default" className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Projections
          </CardTitle>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
            AI-powered
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {projections.map((projection, index) => (
          <motion.div
            key={projection.goal}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{projection.goal}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{projection.dailyAction}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-primary">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-bold">{projection.currentProgress}%</span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${projection.currentProgress}%` }}
                transition={{ duration: 1, delay: 0.3 + index * 0.15 }}
                className="absolute left-0 top-0 h-full bg-primary rounded-full"
              />
            </div>

            {/* Projected completion */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Est. {projection.projectedDate}</span>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                {projection.daysRemaining} days left
              </span>
            </div>
          </motion.div>
        ))}

        {/* Motivational footer */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            <span className="text-primary font-medium">At this rate</span>, you'll achieve both goals ahead of schedule.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
