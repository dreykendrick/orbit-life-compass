import { motion } from "framer-motion";
import { Menu, X, Sun, Moon, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

interface MobileHeaderProps {
  title: string;
}

export const MobileHeader = ({ title }: MobileHeaderProps) => {
  const [isDark, setIsDark] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("orbit-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(saved ? saved === "dark" : prefersDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("orbit-theme", newIsDark ? "dark" : "light");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border safe-area-top"
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">{title}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-secondary rounded-lg transition-colors active:scale-95"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Moon className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors active:scale-95">
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                    A
                  </div>
                  <div>
                    <p className="font-semibold">Alex Johnson</p>
                    <p className="text-sm text-muted-foreground">Free Plan</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">Current streak</p>
                  <p className="text-2xl font-bold text-primary">7 days 🔥</p>
                </div>

                <div className="space-y-1">
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-secondary transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-secondary transition-colors">
                    Notifications
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-secondary transition-colors">
                    Help & Support
                  </button>
                </div>

                <button className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium active:scale-[0.98] transition-transform">
                  Upgrade to Pro
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};
