import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCreateReminder } from "@/hooks/useReminders";
import { useGoals } from "@/hooks/useGoals";
import { useTasks } from "@/hooks/useTasks";

interface Props { children?: React.ReactNode; }

export const AddReminderDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const createReminder = useCreateReminder();
  const { data: goals } = useGoals();
  const { data: tasks } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [repeat, setRepeat] = useState("daily");
  const [linkedType, setLinkedType] = useState("none");
  const [linkedId, setLinkedId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !time) return;
    await createReminder.mutateAsync({
      title: title.trim(),
      description: description.trim() || null,
      reminder_time: time,
      repeat_pattern: repeat,
      custom_days: null,
      linked_type: linkedType !== "none" ? linkedType : null,
      linked_id: linkedId && linkedId !== "none" ? linkedId : null,
      is_active: true,
    });
    setTitle(""); setDescription(""); setTime(""); setRepeat("daily"); setLinkedType("none"); setLinkedId("");
    setOpen(false);
  };

  const linkedItems = linkedType === "goal" ? goals : linkedType === "task" ? tasks : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button className="gap-2 shrink-0"><Plus className="w-4 h-4" />Add Reminder</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>New Reminder</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reminder title" required /></div>
          <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional notes" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Time</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required /></div>
            <div>
              <Label>Repeat</Label>
              <Select value={repeat} onValueChange={setRepeat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Link to</Label>
              <Select value={linkedType} onValueChange={(v) => { setLinkedType(v); setLinkedId(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nothing</SelectItem>
                  <SelectItem value="goal">Goal</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="habit">Habit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {linkedType !== "none" && linkedType !== "habit" && linkedItems && linkedItems.length > 0 && (
              <div>
                <Label>Select {linkedType}</Label>
                <Select value={linkedId} onValueChange={setLinkedId}>
                  <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
                  <SelectContent>
                    {linkedItems.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={createReminder.isPending}>{createReminder.isPending ? "Creating..." : "Create Reminder"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
