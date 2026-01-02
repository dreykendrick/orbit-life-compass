import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, PiggyBank, CreditCard, Target, ChevronRight, Plus, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFinanceSettings, useExpenses, useSavingsGoals, useDeleteExpense, Expense } from "@/hooks/useFinance";
import { UpdateFinanceDialog } from "./UpdateFinanceDialog";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { EditExpenseDialog } from "./EditExpenseDialog";
import { differenceInDays } from "date-fns";

const getCurrencySymbol = (currency: string | null) => {
  switch (currency) {
    case "EUR": return "€";
    case "GBP": return "£";
    case "JPY": return "¥";
    case "CAD": return "C$";
    case "AUD": return "A$";
    case "TZS": return "TSh";
    case "KES": return "KSh";
    default: return "$";
  }
};

export const FinanceView = () => {
  const isMobile = useIsMobile();
  const { data: settings, isLoading: settingsLoading } = useFinanceSettings();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: savingsGoals } = useSavingsGoals();
  const deleteExpense = useDeleteExpense();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const currencySymbol = getCurrencySymbol(settings?.currency);
  const monthlyIncome = settings?.monthly_income || 0;
  
  // Calculate total fixed expenses
  const totalExpenses = expenses?.reduce((sum, expense) => {
    if (expense.is_fixed) {
      if (expense.frequency === "yearly") {
        return sum + (expense.amount / 12);
      } else if (expense.frequency === "weekly") {
        return sum + (expense.amount * 4);
      }
      return sum + expense.amount;
    }
    return sum + expense.amount;
  }, 0) || 0;

  const availableToSave = Math.max(0, monthlyIncome - totalExpenses);
  const expensePercent = monthlyIncome > 0 ? Math.round((totalExpenses / monthlyIncome) * 100) : 0;
  const dailyBudget = Math.round(availableToSave / 30);

  // Get first savings goal
  const primaryGoal = savingsGoals?.[0];
  const goalProgress = primaryGoal && primaryGoal.target_amount > 0 
    ? Math.round(((primaryGoal.current_amount || 0) / primaryGoal.target_amount) * 100) 
    : 0;
  const daysToGoal = primaryGoal?.target_date 
    ? Math.max(0, differenceInDays(new Date(primaryGoal.target_date), new Date())) 
    : null;

  // Group expenses by category for breakdown
  const expensesByCategory = expenses?.reduce((acc, expense) => {
    const cat = expense.category || "other";
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += expense.amount;
    return acc;
  }, {} as Record<string, number>) || {};

  const categoryColors: Record<string, string> = {
    rent: "bg-primary",
    utilities: "bg-accent",
    transportation: "bg-warning",
    subscriptions: "bg-purple-500",
    food: "bg-success",
    entertainment: "bg-pink-500",
    other: "bg-muted-foreground",
  };

  const categoryLabels: Record<string, string> = {
    rent: "Rent",
    utilities: "Utilities",
    transportation: "Transportation",
    subscriptions: "Subscriptions",
    food: "Food & Dining",
    entertainment: "Entertainment",
    other: "Other",
  };

  const hasNoData = !settingsLoading && !expensesLoading && monthlyIncome === 0 && (!expenses || expenses.length === 0);

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
            {hasNoData ? "Set up your income and expenses to get started." : "Simple overview of your financial health."}
          </p>
        </div>
        <UpdateFinanceDialog>
          <Button variant="glass" size={isMobile ? "sm" : "default"} className="shrink-0">
            Update
          </Button>
        </UpdateFinanceDialog>
      </motion.div>

      {/* Empty State */}
      {hasNoData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Wallet className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No financial data yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Start by setting your monthly income and adding your expenses to track your finances.
          </p>
          <div className="flex gap-3">
            <UpdateFinanceDialog>
              <Button>Set Income</Button>
            </UpdateFinanceDialog>
            <AddExpenseDialog>
              <Button variant="outline">Add Expense</Button>
            </AddExpenseDialog>
          </div>
        </motion.div>
      ) : (
        <>
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
                    <p className="text-2xl font-bold">{currencySymbol}{monthlyIncome.toLocaleString()}</p>
                    <p className="text-xs text-success mt-1">Monthly</p>
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
                    <p className="text-2xl font-bold">{currencySymbol}{Math.round(totalExpenses).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{expensePercent}% of income</p>
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
                    <p className="text-2xl font-bold text-primary">{currencySymbol}{Math.round(availableToSave).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{currencySymbol}{dailyBudget}/day budget</p>
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
                        <p className="text-3xl font-bold mt-1">{currencySymbol}{monthlyIncome.toLocaleString()}</p>
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
                        <p className="text-3xl font-bold mt-1">{currencySymbol}{Math.round(totalExpenses).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-2">{expensePercent}% of income</p>
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
                        <p className="text-3xl font-bold mt-1 text-primary">{currencySymbol}{Math.round(availableToSave).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-2">{currencySymbol}{dailyBudget}/day budget</p>
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
                  <span>Daily Budget</span>
                  <span className="text-xl md:text-2xl text-primary">{currencySymbol}{dailyBudget}.00</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2 text-xs md:text-sm">
                      <span className="text-muted-foreground">Based on savings target</span>
                      <span className="font-medium">{currencySymbol}{availableToSave.toLocaleString()} / month</span>
                    </div>
                    <div className="h-2 md:h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, 100 - expensePercent)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 md:pt-2">
                    <span className="text-xs md:text-sm text-success font-medium">{100 - expensePercent}% available</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground">After fixed expenses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Savings Goal */}
          {primaryGoal && (
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
                          <h3 className="font-semibold text-sm md:text-base">{primaryGoal.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {currencySymbol}{primaryGoal.target_amount.toLocaleString()} target • {goalProgress}% complete
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-lg md:text-2xl font-bold text-primary">
                            {currencySymbol}{(primaryGoal.current_amount || 0).toLocaleString()}
                          </span>
                          {isMobile && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                      
                      <div className="h-1.5 md:h-2 bg-secondary rounded-full overflow-hidden mt-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${goalProgress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>

                      <div className="flex items-center justify-between mt-2 text-xs md:text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <PiggyBank className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>Saving {currencySymbol}{dailyBudget}/day</span>
                        </div>
                        {daysToGoal !== null && (
                          <div className="flex items-center gap-1 text-primary">
                            <span className="font-medium">{daysToGoal} days to goal</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Expense Breakdown */}
          {expenses && expenses.length > 0 && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card variant="interactive">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Expense Breakdown</CardTitle>
                  <AddExpenseDialog>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </AddExpenseDialog>
                </CardHeader>
                <CardContent className="space-y-3">
                  {expenses.map((expense) => (
                    <div 
                      key={expense.id} 
                      className="flex items-center justify-between py-2 border-b border-border last:border-0 group cursor-pointer hover:bg-secondary/30 -mx-2 px-2 rounded-lg transition-colors"
                      onClick={() => setEditingExpense(expense)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{expense.title}</span>
                          <span className="font-semibold">{currencySymbol}{expense.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{categoryLabels[expense.category] || expense.category}</span>
                          <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${categoryColors[expense.category] || "bg-muted-foreground"} rounded-full`}
                              style={{ width: `${totalExpenses > 0 ? (expense.amount / totalExpenses) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingExpense(expense);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteExpense.mutate(expense.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Expense List for Mobile */}
          {expenses && expenses.length > 0 && isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">Expenses</CardTitle>
                  <AddExpenseDialog>
                    <Button variant="ghost" size="sm" className="gap-1 h-8">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </AddExpenseDialog>
                </CardHeader>
                <CardContent className="space-y-2">
                  {expenses.slice(0, 5).map((expense) => (
                    <div 
                      key={expense.id} 
                      className="flex items-center justify-between py-2 border-b border-border last:border-0 cursor-pointer"
                      onClick={() => setEditingExpense(expense)}
                    >
                      <div>
                        <p className="font-medium text-sm">{expense.title}</p>
                        <p className="text-xs text-muted-foreground">{categoryLabels[expense.category] || expense.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{currencySymbol}{expense.amount}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteExpense.mutate(expense.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}

      {/* Edit Expense Dialog */}
      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
        />
      )}
    </div>
  );
};
