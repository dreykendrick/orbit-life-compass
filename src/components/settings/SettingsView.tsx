import { motion } from "framer-motion";
import { Settings, User, Bell, Palette, Globe, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", description: "Manage your personal information" },
      { icon: Shield, label: "Security", description: "Password and authentication" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", description: "Alarms, reminders, and alerts" },
      { icon: Palette, label: "Appearance", description: "Theme and display settings" },
      { icon: Globe, label: "Language & Region", description: "Timezone and currency" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center", description: "Get help and learn more" },
    ],
  },
];

export const SettingsView = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6 md:space-y-8 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
          <Settings className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1 md:mt-2">
          Manage your account and preferences.
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="default">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center text-lg md:text-2xl font-bold text-primary-foreground shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-xl font-semibold truncate">Alex Johnson</h2>
                <p className="text-xs md:text-sm text-muted-foreground truncate">alex@example.com</p>
                <div className="flex items-center gap-2 mt-1 md:mt-2">
                  <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    Free Plan
                  </span>
                </div>
              </div>
              <Button variant="default" size={isMobile ? "sm" : "default"} className="shrink-0">
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + groupIndex * 0.1 }}
        >
          <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 md:mb-3">
            {group.title}
          </h3>
          <Card variant="interactive">
            <CardContent className="p-0">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                
                return (
                  <button
                    key={item.label}
                    className={cn(
                      "w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-secondary/50 transition-colors text-left active:bg-secondary",
                      itemIndex !== group.items.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="p-1.5 md:p-2 rounded-lg bg-secondary shrink-0">
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base">{item.label}</p>
                      {!isMobile && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground shrink-0" />
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Button variant="ghost" className="w-full justify-start gap-2 md:gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 active:bg-destructive/20">
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
};
