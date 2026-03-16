import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { format } from "date-fns";

export interface DailyReflection {
  id: string;
  user_id: string;
  reflection_date: string;
  mood: number | null;
  accomplishments: string | null;
  challenges: string | null;
  tomorrow_goals: string | null;
  gratitude: string | null;
  created_at: string;
  updated_at: string;
}

export const useTodayReflection = () => {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");
  return useQuery({
    queryKey: ["daily_reflection", user?.id, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_reflections")
        .select("*")
        .eq("reflection_date", today)
        .maybeSingle();
      if (error) throw error;
      return data as DailyReflection | null;
    },
    enabled: !!user,
  });
};

export const useReflections = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["daily_reflections", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_reflections")
        .select("*")
        .order("reflection_date", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data as DailyReflection[];
    },
    enabled: !!user,
  });
};

export const useUpsertReflection = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (reflection: Omit<DailyReflection, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("daily_reflections")
        .upsert(
          { ...reflection, user_id: user!.id },
          { onConflict: "user_id,reflection_date" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily_reflection"] });
      queryClient.invalidateQueries({ queryKey: ["daily_reflections"] });
      toast.success("Reflection saved!");
    },
    onError: () => toast.error("Failed to save reflection"),
  });
};
