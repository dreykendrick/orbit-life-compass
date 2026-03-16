import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare,
  Clock, 
  Zap,
  Wallet,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, BookOpen, Settings } from "lucide-react";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const mainNavItems = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "focus", label: "Focus", icon: Zap },
  { id: "goals", label: "Goals", icon: Target },
];

const moreItems = [
  { id: "routines", label: "Routines", icon: Clock },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "reflections", label: "Reflect", icon: BookOpen },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "settings", label: "Settings", icon: Settings },
];

export const MobileNav = ({ activeTab, setActiveTab }: MobileNavProps) => {
  const isMoreActive = moreItems.some((item) => item.id === activeTab);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[56px] py-2 px-3 rounded-xl transition-all duration-200 active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div layoutId="mobileActiveTab" className="absolute inset-0 bg-primary/10 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
              )}
              <Icon className={cn("w-6 h-6 relative z-10 transition-transform duration-200", isActive && "scale-110")} />
              <span className={cn("text-[10px] mt-1 font-medium relative z-10", isActive && "font-semibold")}>{item.label}</span>
            </button>
          );
        })}

        {/* More menu */}
        <Popover>
          <PopoverTrigger asChild>
            <button className={cn(
              "relative flex flex-col items-center justify-center min-w-[56px] py-2 px-3 rounded-xl transition-all duration-200 active:scale-95",
              isMoreActive ? "text-primary" : "text-muted-foreground"
            )}>
              {isMoreActive && (
                <motion.div layoutId="mobileActiveTab" className="absolute inset-0 bg-primary/10 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
              )}
              <MoreHorizontal className="w-6 h-6 relative z-10" />
              <span className={cn("text-[10px] mt-1 font-medium relative z-10", isMoreActive && "font-semibold")}>More</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end" side="top">
            {moreItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
                    activeTab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </PopoverContent>
        </Popover>
      </div>
    </motion.nav>
  );
};
