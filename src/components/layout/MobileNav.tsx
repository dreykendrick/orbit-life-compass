import { forwardRef } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Target, 
  Clock, 
  Wallet, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "goals", label: "Goals", icon: Target },
  { id: "routines", label: "Routines", icon: Clock },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "settings", label: "Settings", icon: Settings },
];

export const MobileNav = forwardRef<HTMLElement, MobileNavProps>(({ activeTab, setActiveTab }, ref) => {
  return (
    <motion.nav
      ref={ref}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[56px] py-2 px-3 rounded-xl transition-all duration-200 active:scale-95",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className={cn(
                "w-6 h-6 relative z-10 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[10px] mt-1 font-medium relative z-10",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
});

MobileNav.displayName = "MobileNav";
