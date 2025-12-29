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
