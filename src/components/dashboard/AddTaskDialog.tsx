import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useCreateRoutine } from "@/hooks/useRoutines";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddTaskDialogProps {
  children?: React.ReactNode;
}

export const AddTaskDialog = ({ children }: AddTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [frequency, setFrequency] = useState("daily");
  
  const isMobile = useIsMobile();
  const createRoutine = useCreateRoutine();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createRoutine.mutateAsync({
      title,
      description: description || null,
      start_time: startTime,
      duration_minutes: parseInt(durationMinutes),
      frequency,
      custom_days: null,
      is_active: true,
      alarm_enabled: false,
    });

    // Reset form and close
    setTitle("");
    setDescription("");
    setStartTime("09:00");
    setDurationMinutes("30");
    setFrequency("daily");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="default" size={isMobile ? "default" : "lg"} className="gap-2 shrink-0">
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Name</Label>
            <Input
              id="title"
              placeholder="e.g., Review project proposal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Scheduled Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="480"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Repeat</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekdays">Weekdays</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createRoutine.isPending}
            >
              {createRoutine.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
