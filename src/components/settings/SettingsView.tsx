import { motion } from "framer-motion";
import { Settings, User, Bell, Palette, Globe, Shield, HelpCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences.
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="gradient">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-glow">
                A
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">Alex Johnson</h2>
                <p className="text-muted-foreground">alex@example.com</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    Free Plan
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">Member since Dec 2024</span>
                </div>
              </div>
              <Button variant="glow">Upgrade</Button>
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
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
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
                      "w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left",
                      itemIndex !== group.items.length - 1 && "border-b border-border"
                    )}
                  >
                    <div className="p-2 rounded-lg bg-secondary">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-muted-foreground">→</div>
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
        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
};
