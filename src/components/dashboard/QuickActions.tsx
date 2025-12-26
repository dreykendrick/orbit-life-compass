import { motion } from "framer-motion";
import { Plus, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const QuickActions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap items-center gap-3"
    >
      <Button variant="default" size="lg" className="gap-2">
        <Plus className="w-5 h-5" />
        Add Task
      </Button>
      
      <Button variant="glass" size="lg" className="gap-2">
        <PlayCircle className="w-5 h-5" />
        Start Focus
      </Button>
      
      <Button variant="glass" size="lg" className="gap-2">
        <Sparkles className="w-5 h-5" />
        AI Plan
      </Button>
    </motion.div>
  );
};
