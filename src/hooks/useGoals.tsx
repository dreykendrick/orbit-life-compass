import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string | null;
  target_value: number | null;
  current_value: number | null;
  target_date: string | null;
  daily_action: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useGoals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!user,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (goal: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("goals")
        .insert({ ...goal, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal created!");
    },
    onError: (error) => {
      toast.error("Failed to create goal");
      console.error(error);
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      const { data, error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal updated!");
    },
    onError: (error) => {
      toast.error("Failed to update goal");
      console.error(error);
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      toast.success("Goal deleted!");
    },
    onError: (error) => {
      toast.error("Failed to delete goal");
      console.error(error);
    },
  });
};
