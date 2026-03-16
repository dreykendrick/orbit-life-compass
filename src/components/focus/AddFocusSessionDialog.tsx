import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCreateFocusSession } from "@/hooks/useFocusSessions";
import { useGoals } from "@/hooks/useGoals";
import { useTasks } from "@/hooks/useTasks";

interface Props { children?: React.ReactNode; }

export const AddFocusSessionDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const createSession = useCreateFocusSession();
  const { data: goals } = useGoals();
  const { data: tasks } = useTasks();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("25");
  const [goalId, setGoalId] = useState("");
  const [taskId, setTaskId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startTime) return;
    await createSession.mutateAsync({
      title: title.trim(),
      start_time: new Date(startTime).toISOString(),
      duration_minutes: parseInt(duration),
      goal_id: goalId && goalId !== "none" ? goalId : null,
      task_id: taskId && taskId !== "none" ? taskId : null,
      status: "scheduled",
      notes: null,
    });
    setTitle(""); setStartTime(""); setDuration("25"); setGoalId(""); setTaskId("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button className="gap-2 shrink-0"><Plus className="w-4 h-4" />Schedule Session</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Schedule Focus Session</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What will you focus on?" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Start Time</Label><Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></div>
            <div>
              <Label>Duration (min)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[15, 25, 30, 45, 60, 90, 120].map((m) => <SelectItem key={m} value={String(m)}>{m} min</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Linked Goal</Label>
              <Select value={goalId} onValueChange={setGoalId}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {goals?.map((g) => <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Linked Task</Label>
              <Select value={taskId} onValueChange={setTaskId}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {tasks?.filter((t) => t.status !== "completed").map((t) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={createSession.isPending}>{createSession.isPending ? "Scheduling..." : "Schedule Session"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
