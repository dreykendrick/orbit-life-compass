import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useStreak } from "@/hooks/useTaskCompletions";
import { NotificationBell } from "@/components/notifications/NotificationCenter";
import orbitLogo from "@/assets/orbit-logo.png";

interface MobileHeaderProps {
  title: string;
  setActiveTab?: (tab: string) => void;
  onNotificationClick?: () => void;
}

export const MobileHeader = ({ title, setActiveTab, onNotificationClick }: MobileHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: streak = 0 } = useStreak();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleNavigation = (tab: string) => {
    if (setActiveTab) setActiveTab(tab);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border safe-area-top"
    >
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <img src={orbitLogo} alt="ORBIT" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-bold text-lg">{title}</span>
        </div>

        <div className="flex items-center gap-1">
          {onNotificationClick && <NotificationBell onClick={onNotificationClick} />}
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
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-sm text-muted-foreground">Free Plan</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {streak > 0 && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground mb-1">Current streak</p>
                    <p className="text-2xl font-bold text-primary">{streak} day{streak !== 1 ? 's' : ''} 🔥</p>
                  </div>
                )}
                <div className="space-y-1">
                  <button onClick={() => handleNavigation("settings")} className="w-full text-left px-4 py-3 rounded-xl hover:bg-secondary transition-colors">Profile Settings</button>
                </div>
                <button onClick={handleSignOut} className="w-full px-4 py-3 rounded-xl border border-border text-muted-foreground hover:bg-secondary font-medium transition-colors">Sign Out</button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};
