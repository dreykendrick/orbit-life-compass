import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface FinanceSettings {
  id: string;
  user_id: string;
  monthly_income: number | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  is_fixed: boolean | null;
  frequency: string | null;
  created_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number | null;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export const useFinanceSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["financeSettings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("finance_settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as FinanceSettings | null;
    },
    enabled: !!user,
  });
};

export const useUpdateFinanceSettings = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (settings: { monthly_income?: number; currency?: string }) => {
      // Try to update first
      const { data: existing } = await supabase
        .from("finance_settings")
        .select("id")
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from("finance_settings")
          .update(settings)
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("finance_settings")
          .insert({ ...settings, user_id: user!.id })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financeSettings"] });
      toast.success("Finance settings updated!");
    },
    onError: (error) => {
      toast.error("Failed to update settings");
      console.error(error);
    },
  });
};

export const useExpenses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!user,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (expense: Omit<Expense, "id" | "user_id" | "created_at">) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert({ ...expense, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense added!");
    },
    onError: (error) => {
      toast.error("Failed to add expense");
      console.error(error);
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense removed!");
    },
    onError: (error) => {
      toast.error("Failed to remove expense");
      console.error(error);
    },
  });
};

export const useSavingsGoals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["savingsGoals", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SavingsGoal[];
    },
    enabled: !!user,
  });
};

export const useCreateSavingsGoal = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (goal: Omit<SavingsGoal, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("savings_goals")
        .insert({ ...goal, user_id: user!.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      toast.success("Savings goal created!");
    },
    onError: (error) => {
      toast.error("Failed to create savings goal");
      console.error(error);
    },
  });
};

export const useUpdateSavingsGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SavingsGoal> & { id: string }) => {
      const { data, error } = await supabase
        .from("savings_goals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
      toast.success("Savings goal updated!");
    },
    onError: (error) => {
      toast.error("Failed to update savings goal");
      console.error(error);
    },
  });
};
