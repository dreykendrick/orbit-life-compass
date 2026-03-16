import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Plus, Calendar, Flag, Target, Trash2, Edit2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTasks, useDeleteTask, useUpdateTask, Task } from "@/hooks/useTasks";
import { useGoals } from "@/hooks/useGoals";
import { AddTaskDialog } from "./AddTaskDialog";
import { EditTaskDialog } from "./EditTaskDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const priorityConfig: Record<string, { label: string; color: string }> = {
  high: { label: "High", color: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { label: "Medium", color: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "Low", color: "bg-success/10 text-success border-success/20" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "In Progress", color: "bg-primary/10 text-primary" },
  completed: { label: "Done", color: "bg-success/10 text-success" },
};

export const TasksView = () => {
  const { data: tasks, isLoading } = useTasks();
  const { data: goals } = useGoals();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this task?")) await deleteTask.mutateAsync(id);
  };

  const handleComplete = async (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateTask.mutateAsync({
      id: task.id,
      status: task.status === "completed" ? "pending" : "completed",
    });
  };

  const getGoalTitle = (goalId: string | null) => {
    if (!goalId || !goals) return null;
    return goals.find((g) => g.id === goalId)?.title || null;
  };

  const filteredTasks = tasks?.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
            <CheckSquare className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
            <span>Tasks</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 md:mt-2">Manage your tasks and stay on track with your goals.</p>
        </div>
        <AddTaskDialog />
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "in_progress", label: "In Progress" },
          { key: "completed", label: "Completed" },
        ].map((f) => (
          <Button key={f.key} variant={filter === f.key ? "default" : "outline"} size="sm" onClick={() => setFilter(f.key)}>
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      )}

      {!isLoading && (!filteredTasks || filteredTasks.length === 0) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckSquare className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">Create tasks to break down your goals into actionable steps.</p>
          <AddTaskDialog>
            <Button className="gap-2"><Plus className="w-4 h-4" />Create Your First Task</Button>
          </AddTaskDialog>
        </motion.div>
      )}

      {!isLoading && filteredTasks && filteredTasks.length > 0 && (
        <div className="space-y-2">
          {filteredTasks.map((task, index) => {
            const priority = priorityConfig[task.priority] || priorityConfig.medium;
            const status = statusConfig[task.status] || statusConfig.pending;
            const goalTitle = getGoalTitle(task.goal_id);
            return (
              <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <Card variant="interactive" className={cn("cursor-pointer active:scale-[0.99] transition-all", task.status === "completed" && "opacity-60")} onClick={() => setEditingTask(task)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleComplete(task, e)}
                        className={cn(
                          "w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                          task.status === "completed" ? "bg-success border-success text-success-foreground" : "border-muted-foreground/30 hover:border-primary"
                        )}
                      >
                        {task.status === "completed" && <Check className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={cn("font-medium text-sm truncate", task.status === "completed" && "line-through")}>{task.title}</h3>
                          <Badge variant="outline" className={cn("text-[10px]", priority.color)}>{priority.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {goalTitle && (
                            <span className="flex items-center gap-1"><Target className="w-3 h-3" />{goalTitle}</span>
                          )}
                          {task.due_date && (
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(task.due_date), "MMM d")}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}>
                          <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors" onClick={(e) => handleDelete(task.id, e)}>
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {editingTask && (
        <EditTaskDialog task={editingTask} open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)} />
      )}
    </div>
  );
};
