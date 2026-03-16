import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, Clock, Target, CheckSquare, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReminders, useDeleteReminder, useUpdateReminder, Reminder } from "@/hooks/useReminders";
import { AddReminderDialog } from "./AddReminderDialog";
import { Skeleton } from "@/components/ui/skeleton";

const linkedIcons: Record<string, React.ReactNode> = {
  goal: <Target className="w-3 h-3" />,
  task: <CheckSquare className="w-3 h-3" />,
  habit: <Repeat className="w-3 h-3" />,
};

export const RemindersView = () => {
  const { data: reminders, isLoading } = useReminders();
  const deleteReminder = useDeleteReminder();
  const updateReminder = useUpdateReminder();

  const handleToggle = async (reminder: Reminder) => {
    await updateReminder.mutateAsync({ id: reminder.id, is_active: !reminder.is_active });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this reminder?")) await deleteReminder.mutateAsync(id);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
            <Bell className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
            <span>Reminders</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 md:mt-2">Never miss what matters with smart reminders.</p>
        </div>
        <AddReminderDialog />
      </motion.div>

      {isLoading && (
        <div className="space-y-3">{[1, 2].map((i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>)}</div>
      )}

      {!isLoading && (!reminders || reminders.length === 0) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"><Bell className="w-8 h-8 text-primary" /></div>
          <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">Create reminders to stay on top of your goals and tasks.</p>
          <AddReminderDialog><Button className="gap-2"><Plus className="w-4 h-4" />Create Your First Reminder</Button></AddReminderDialog>
        </motion.div>
      )}

      {!isLoading && reminders && reminders.length > 0 && (
        <div className="space-y-2">
          {reminders.map((reminder, index) => (
            <motion.div key={reminder.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <Card variant="interactive" className={cn(!reminder.is_active && "opacity-50")}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{reminder.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{reminder.reminder_time.slice(0, 5)}</span>
                        <span className="capitalize">{reminder.repeat_pattern}</span>
                        {reminder.linked_type && <span className="flex items-center gap-1">{linkedIcons[reminder.linked_type]}{reminder.linked_type}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleToggle(reminder)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                        {reminder.is_active ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5 text-muted-foreground" />}
                      </button>
                      <button className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors" onClick={(e) => handleDelete(reminder.id, e)}>
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
