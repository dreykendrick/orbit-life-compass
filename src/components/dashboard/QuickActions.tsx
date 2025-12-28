import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddTaskDialog } from "./AddTaskDialog";
import { FocusTimerDialog } from "./FocusTimerDialog";
import { AIPlanDialog } from "./AIPlanDialog";
import { Button } from "@/components/ui/button";
import { Plus, PlayCircle, Sparkles } from "lucide-react";

export const QuickActions = () => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible scrollbar-hide"
    >
      <AddTaskDialog>
        <Button variant="default" size={isMobile ? "default" : "lg"} className="gap-2 shrink-0">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Add Task
        </Button>
      </AddTaskDialog>
      
      <FocusTimerDialog>
        <Button variant="glass" size={isMobile ? "default" : "lg"} className="gap-2 shrink-0">
          <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
          Focus
        </Button>
      </FocusTimerDialog>
      
      <AIPlanDialog>
        <Button variant="glass" size={isMobile ? "default" : "lg"} className="gap-2 shrink-0">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
          AI Plan
        </Button>
      </AIPlanDialog>
    </motion.div>
  );
};
