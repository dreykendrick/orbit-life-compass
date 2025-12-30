import { motion } from "framer-motion";
import { Settings, User, Bell, Palette, Globe, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", description: "Manage your personal information", action: "profile" },
      { icon: Shield, label: "Security", description: "Password and authentication", action: "security" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", description: "Alarms, reminders, and alerts", action: "notifications" },
      { icon: Palette, label: "Appearance", description: "Theme and display settings", action: "appearance" },
      { icon: Globe, label: "Language & Region", description: "Timezone and currency", action: "region" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center", description: "Get help and learn more", action: "help" },
    ],
  },
];

export const SettingsView = () => {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const currentDisplayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const initials = currentDisplayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleItemClick = (action: string) => {
    switch (action) {
      case "profile":
        setDisplayName(profile?.display_name || "");
        setProfileDialogOpen(true);
        break;
      case "security":
        toast.info("Security settings", {
          description: "Password management will be available soon. Your account is secured with Lovable Cloud authentication.",
        });
        break;
      case "notifications":
        toast.info("Notifications", {
          description: "Push notifications will be available in the next update. Check your routines for alarm settings!",
        });
        break;
      case "appearance":
        const isDark = document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", !isDark);
        localStorage.setItem("orbit-theme", !isDark ? "dark" : "light");
        toast.success(`Switched to ${!isDark ? "dark" : "light"} mode`);
        break;
      case "region":
        toast.info("Language & Region", {
          description: "Timezone and language settings coming soon!",
        });
        break;
      case "help":
        window.open("mailto:support@orbit.app?subject=Help Request", "_blank");
        toast.success("Opening email client for support");
        break;
    }
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      toast.error("Please enter a display name");
      return;
    }
    
    updateProfile.mutate(
      { display_name: displayName.trim() },
      {
        onSuccess: () => {
          setProfileDialogOpen(false);
          toast.success("Profile updated!");
        },
      }
    );
  };

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
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base md:text-xl font-semibold truncate">{currentDisplayName}</h2>
                <p className="text-xs md:text-sm text-muted-foreground truncate">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1 md:mt-2">
                  <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    Free Plan
                  </span>
                </div>
              </div>
              <Button variant="default" size={isMobile ? "sm" : "default"} className="shrink-0" onClick={() => toast.info("Pro features coming soon!")}>
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
                    onClick={() => handleItemClick(item.action)}
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
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 md:gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 active:bg-destructive/20"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          Sign Out
        </Button>
      </motion.div>

      {/* Profile Edit Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};