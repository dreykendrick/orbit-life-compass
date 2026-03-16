import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface FocusSession {
  id: string;
  user_id: string;
  title: string;
  goal_id: string | null;
  task_id: string | null;
  start_time: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useFocusSessions = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["focus_sessions", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("focus_sessions")
        .select("*")
        .order("start_time", { ascending: false });
      if (error) throw error;
      return data as FocusSession[];
    },
    enabled: !!user,
  });
};

export const useCreateFocusSession = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (session: Omit<FocusSession, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("focus_sessions")
        .insert({ ...session, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focus_sessions"] });
      toast.success("Focus session scheduled!");
    },
    onError: () => toast.error("Failed to create focus session"),
  });
};

export const useUpdateFocusSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FocusSession> & { id: string }) => {
      const { data, error } = await supabase
        .from("focus_sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focus_sessions"] });
    },
    onError: () => toast.error("Failed to update focus session"),
  });
};

export const useDeleteFocusSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("focus_sessions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focus_sessions"] });
      toast.success("Focus session deleted!");
    },
    onError: () => toast.error("Failed to delete focus session"),
  });
};
