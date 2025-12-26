import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Target, 
  Clock, 
  Wallet, 
  Settings,
  ChevronLeft,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "goals", label: "Goals", icon: Target },
  { id: "routines", label: "Routines", icon: Clock },
  { id: "finance", label: "Finance", icon: Wallet },
  { id: "settings", label: "Settings", icon: Settings },
];

export const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check for saved preference or system preference
    const saved = localStorage.getItem("orbit-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = saved ? saved === "dark" : prefersDark;
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("orbit-theme", newIsDark ? "dark" : "light");
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-foreground">ORBIT</span>
          )}
        </motion.div>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          <ChevronLeft className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-300",
            isCollapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "text-primary"
                  )} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
            "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
          )}
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          {!isCollapsed && (
            <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>

        {!isCollapsed && (
          <div className="px-4 py-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Current streak</p>
            <p className="text-2xl font-bold text-primary">7 days</p>
          </div>
        )}
      </div>
    </motion.aside>
  );
};
