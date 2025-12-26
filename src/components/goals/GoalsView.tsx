import { motion } from "framer-motion";
import { Target, TrendingUp, Calendar, Plus, Sparkles, DollarSign, BookOpen, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Goal {
  id: string;
  title: string;
  category: string;
  icon: typeof Target;
  progress: number;
  target: string;
  current: string;
  projectedDate: string;
  dailyAction: string;
  color: string;
}

const goals: Goal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    category: "Finance",
    icon: DollarSign,
    progress: 68,
    target: "$5,000",
    current: "$3,400",
    projectedDate: "March 15, 2025",
    dailyAction: "Save $21/day",
    color: "primary",
  },
  {
    id: "2",
    title: "Learn French (B1 Level)",
    category: "Learning",
    icon: BookOpen,
    progress: 42,
    target: "B1 Fluency",
    current: "A2 Level",
    projectedDate: "June 20, 2025",
    dailyAction: "Practice 30 min/day",
    color: "accent",
  },
  {
    id: "3",
    title: "Run a Half Marathon",
    category: "Fitness",
    icon: Dumbbell,
    progress: 35,
    target: "21.1 km",
    current: "7 km max",
    projectedDate: "September 1, 2025",
    dailyAction: "Train 4x/week",
    color: "success",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
    progress: "bg-primary",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    border: "border-accent/20",
    progress: "bg-accent",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/20",
    progress: "bg-success",
  },
};

export const GoalsView = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Goals & Projections
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your long-term objectives and see where your daily actions lead.
          </p>
        </div>
        <Button variant="default" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
      </motion.div>

      {/* AI Insight Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="glow" className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">AI Insight</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on your current pace, you're on track to achieve <span className="text-primary font-medium">2 out of 3</span> goals 
                  ahead of schedule. Increasing French practice by 10 minutes would accelerate that goal by 3 weeks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.map((goal, index) => {
          const Icon = goal.icon;
          const colors = colorClasses[goal.color as keyof typeof colorClasses];
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card variant="interactive" className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                      {goal.category}
                    </span>
                  </div>
                  <CardTitle className="mt-4">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className={`font-bold ${colors.text}`}>{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                        className={`h-full ${colors.progress} rounded-full`}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="font-semibold">{goal.current}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Target</p>
                      <p className="font-semibold">{goal.target}</p>
                    </div>
                  </div>

                  {/* Projection */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Est. completion:</span>
                      <span className="font-medium">{goal.projectedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Daily action:</span>
                      <span className={`font-medium ${colors.text}`}>{goal.dailyAction}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Projection Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="default">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Future Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline */}
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-primary via-accent to-success" />
                
                {["Now", "3 months", "6 months", "9 months", "1 year"].map((label, i) => (
                  <div key={label} className="relative z-10 flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${i === 0 ? 'bg-primary' : 'bg-secondary border-2 border-border'}`} />
                    <span className="mt-3 text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              {/* Goal markers */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Emergency Fund completed</span>
                  <span className="text-primary font-medium ml-auto">~3 months</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-muted-foreground">French B1 achieved</span>
                  <span className="text-accent font-medium ml-auto">~6 months</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-muted-foreground">Half Marathon ready</span>
                  <span className="text-success font-medium ml-auto">~8 months</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
