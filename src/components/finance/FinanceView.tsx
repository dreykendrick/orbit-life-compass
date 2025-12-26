import { motion } from "framer-motion";
import { Wallet, TrendingUp, PiggyBank, CreditCard, Target, ArrowRight, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const FinanceView = () => {
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
            <Wallet className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
            <span>Finance</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 md:mt-2">
            Simple overview of your financial health.
          </p>
        </div>
        <Button variant="glass" size={isMobile ? "sm" : "default"} className="shrink-0">
          Update
        </Button>
      </motion.div>

      {/* Main Stats - Horizontal scroll on mobile */}
      {isMobile ? (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shrink-0 w-40"
          >
            <Card variant="default">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-success/10">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-xs text-muted-foreground">Income</span>
                </div>
                <p className="text-2xl font-bold">$4,500</p>
                <p className="text-xs text-success mt-1">Stable</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="shrink-0 w-40"
          >
            <Card variant="default">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-warning/10">
                    <CreditCard className="w-4 h-4 text-warning" />
                  </div>
                  <span className="text-xs text-muted-foreground">Expenses</span>
                </div>
                <p className="text-2xl font-bold">$2,850</p>
                <p className="text-xs text-muted-foreground mt-1">63% of income</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="shrink-0 w-40"
          >
            <Card variant="glow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <PiggyBank className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">To Save</span>
                </div>
                <p className="text-2xl font-bold text-primary">$1,650</p>
                <p className="text-xs text-muted-foreground mt-1">$55/day budget</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="default" className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                    <p className="text-3xl font-bold mt-1">$4,500</p>
                    <div className="flex items-center gap-1 mt-2 text-success text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>Stable</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-success/10">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card variant="default" className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Fixed Expenses</p>
                    <p className="text-3xl font-bold mt-1">$2,850</p>
                    <p className="text-xs text-muted-foreground mt-2">63% of income</p>
                  </div>
                  <div className="p-4 rounded-xl bg-warning/10">
                    <CreditCard className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glow" className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available to Save</p>
                    <p className="text-3xl font-bold mt-1 text-primary">$1,650</p>
                    <p className="text-xs text-muted-foreground mt-2">$55/day budget</p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/10">
                    <PiggyBank className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Daily Budget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Card variant="glass">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="flex items-center justify-between text-base md:text-xl">
              <span>Today's Budget</span>
              <span className="text-xl md:text-2xl text-primary">$55.00</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2 text-xs md:text-sm">
                  <span className="text-muted-foreground">Spent today</span>
                  <span className="font-medium">$32.50 / $55.00</span>
                </div>
                <div className="h-2 md:h-3 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "59%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-1 md:pt-2">
                <span className="text-xs md:text-sm text-success font-medium">$22.50 remaining</span>
                <span className="text-[10px] md:text-xs text-muted-foreground">Resets at midnight</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Savings Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="interactive" className="active:scale-[0.99] transition-transform">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 rounded-xl bg-primary/10 shrink-0">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base">Emergency Fund</h3>
                    <p className="text-xs text-muted-foreground">$5,000 target • 68% complete</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-lg md:text-2xl font-bold text-primary">$3,400</span>
                    {isMobile && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                
                <div className="h-1.5 md:h-2 bg-secondary rounded-full overflow-hidden mt-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "68%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>

                <div className="flex items-center justify-between mt-2 text-xs md:text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <PiggyBank className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>Saving $21/day</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="font-medium">78 days to goal</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expense Breakdown - Desktop only */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card variant="interactive">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Rent", amount: "$1,200", percent: 42, color: "bg-primary" },
                { name: "Utilities", amount: "$150", percent: 5, color: "bg-accent" },
                { name: "Transportation", amount: "$300", percent: 11, color: "bg-warning" },
                { name: "Subscriptions", amount: "$100", percent: 4, color: "bg-purple-500" },
                { name: "Food & Dining", amount: "$600", percent: 21, color: "bg-success" },
                { name: "Other", amount: "$500", percent: 17, color: "bg-muted-foreground" },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.amount}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
