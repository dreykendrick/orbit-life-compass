import { motion } from "framer-motion";
import { Target, TrendingUp, Calendar, Plus, Sparkles, DollarSign, BookOpen, Dumbbell, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
    progress: "bg-primary",
  },
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
    progress: "bg-accent",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    progress: "bg-success",
  },
};

export const GoalsView = () => {
  const isMobile = useIsMobile();

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
        <Button variant="default" size={isMobile ? "sm" : "default"} className="gap-1 md:gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          {!isMobile && "Add Goal"}
        </Button>
      </motion.div>

      {/* AI Insight Banner */}
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
                <h3 className="font-semibold text-sm md:text-base">AI Insight</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  You're on track to achieve <span className="text-primary font-medium">2 out of 3</span> goals 
                  ahead of schedule.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Goals List */}
      <div className="space-y-3 md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-6 md:space-y-0">
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
              <Card variant="interactive" className="h-full active:scale-[0.98] transition-transform">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className={`p-2.5 md:p-3 rounded-xl ${colors.bg} shrink-0`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm md:text-base truncate">{goal.title}</h3>
                          <p className="text-xs text-muted-foreground">{goal.dailyAction}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`font-bold text-sm md:text-base ${colors.text}`}>{goal.progress}%</span>
                          {isMobile && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="h-1.5 md:h-2 bg-secondary rounded-full overflow-hidden mt-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          className={`h-full ${colors.progress} rounded-full`}
                        />
                      </div>

                      {/* Stats - hidden on mobile for cleaner look */}
                      {!isMobile && (
                        <>
                          <div className="grid grid-cols-2 gap-4 py-3 mt-3 border-t border-border">
                            <div>
                              <p className="text-xs text-muted-foreground">Current</p>
                              <p className="font-semibold text-sm">{goal.current}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Target</p>
                              <p className="font-semibold text-sm">{goal.target}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm mt-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Est. {goal.projectedDate}</span>
                          </div>
                        </>
                      )}

                      {isMobile && (
                        <div className="flex items-center justify-between mt-3 text-xs">
                          <span className="text-muted-foreground">{goal.current} → {goal.target}</span>
                          <span className={`${colors.text} font-medium`}>{goal.projectedDate.split(',')[0]}</span>
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

      {/* Projection Timeline - Desktop only */}
      {!isMobile && (
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
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-primary via-accent to-success" />
                  
                  {["Now", "3 months", "6 months", "9 months", "1 year"].map((label, i) => (
                    <div key={label} className="relative z-10 flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${i === 0 ? 'bg-primary' : 'bg-secondary border-2 border-border'}`} />
                      <span className="mt-3 text-xs text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>

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
      )}
    </div>
  );
};
