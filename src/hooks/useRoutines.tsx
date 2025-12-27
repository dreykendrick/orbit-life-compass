import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Routine {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  frequency: string;
  start_time: string;
  duration_minutes: number;
  custom_days: number[] | null;
  is_active: boolean | null;
  alarm_enabled: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useRoutines = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["routines", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routines")
        .select("*")
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data as Routine[];
    },
    enabled: !!user,
  });
};

export const useCreateRoutine = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (routine: Omit<Routine, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("routines")
        .insert({ ...routine, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success("Routine created!");
    },
    onError: (error) => {
      toast.error("Failed to create routine");
      console.error(error);
    },
  });
};

export const useUpdateRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Routine> & { id: string }) => {
      const { data, error } = await supabase
        .from("routines")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success("Routine updated!");
    },
    onError: (error) => {
      toast.error("Failed to update routine");
      console.error(error);
    },
  });
};

export const useDeleteRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("routines")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      toast.success("Routine deleted!");
    },
    onError: (error) => {
      toast.error("Failed to delete routine");
      console.error(error);
    },
  });
};
