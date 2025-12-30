import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

export interface TaskCompletion {
  id: string;
  routine_id: string;
  user_id: string;
  completed_date: string;
  completed_at: string | null;
  status: string;
  created_at: string;
}

export const useTaskCompletions = (date?: Date) => {
  const { user } = useAuth();
  const targetDate = date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");

  return useQuery({
    queryKey: ["task_completions", user?.id, targetDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_completions")
        .select("*")
        .eq("completed_date", targetDate)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data as TaskCompletion[];
    },
    enabled: !!user,
  });
};

export const useTodayStats = () => {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");

  return useQuery({
    queryKey: ["today_stats", user?.id, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_completions")
        .select("*")
        .eq("completed_date", today);

      if (error) throw error;
      return data as TaskCompletion[];
    },
    enabled: !!user,
  });
};

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ routineId, date }: { routineId: string; date: Date }) => {
      const completedDate = format(date, "yyyy-MM-dd");
      
      // Check if already completed
      const { data: existing } = await supabase
        .from("task_completions")
        .select("id")
        .eq("routine_id", routineId)
        .eq("completed_date", completedDate)
        .single();

      if (existing) {
        // Remove completion
        const { error } = await supabase
          .from("task_completions")
          .delete()
          .eq("id", existing.id);
        if (error) throw error;
        return { action: "uncompleted" };
      } else {
        // Add completion
        const { error } = await supabase
          .from("task_completions")
          .insert({
            routine_id: routineId,
            user_id: user!.id,
            completed_date: completedDate,
            status: "completed",
          });
        if (error) throw error;
        return { action: "completed" };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["task_completions"] });
      queryClient.invalidateQueries({ queryKey: ["today_stats"] });
      toast.success(result.action === "completed" ? "Task completed!" : "Task unmarked");
    },
    onError: (error) => {
      toast.error("Failed to update task");
      console.error(error);
    },
  });
};

export const useStreak = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      // Get all completions ordered by date
      const { data, error } = await supabase
        .from("task_completions")
        .select("completed_date")
        .order("completed_date", { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return 0;

      // Get unique dates
      const uniqueDates = [...new Set(data.map(c => c.completed_date))].sort().reverse();
      
      if (uniqueDates.length === 0) return 0;

      const today = format(new Date(), "yyyy-MM-dd");
      const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
      
      // Streak must start from today or yesterday
      if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        return 0;
      }

      let streak = 0;
      let checkDate = new Date(uniqueDates[0]);

      for (const dateStr of uniqueDates) {
        const expectedDate = format(checkDate, "yyyy-MM-dd");
        if (dateStr === expectedDate) {
          streak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
        } else {
          break;
        }
      }

      return streak;
    },
    enabled: !!user,
  });
};
