-- Drop the old constraint and add a new one with the correct categories
ALTER TABLE public.goals DROP CONSTRAINT goals_category_check;

ALTER TABLE public.goals ADD CONSTRAINT goals_category_check 
CHECK (category = ANY (ARRAY['finance'::text, 'fitness'::text, 'learning'::text, 'health'::text, 'career'::text, 'personal'::text]));