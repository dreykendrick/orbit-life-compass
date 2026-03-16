import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  reminder_time: string;
  repeat_pattern: string;
  custom_days: number[] | null;
  linked_type: string | null;
  linked_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useReminders = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reminders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .order("reminder_time", { ascending: true });
      if (error) throw error;
      return data as Reminder[];
    },
    enabled: !!user,
  });
};

export const useCreateReminder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (reminder: Omit<Reminder, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("reminders")
        .insert({ ...reminder, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder created!");
    },
    onError: () => toast.error("Failed to create reminder"),
  });
};

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Reminder> & { id: string }) => {
      const { data, error } = await supabase
        .from("reminders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder updated!");
    },
    onError: () => toast.error("Failed to update reminder"),
  });
};

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reminders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder deleted!");
    },
    onError: () => toast.error("Failed to delete reminder"),
  });
};
