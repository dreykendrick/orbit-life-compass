import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllRead, AppNotification } from "@/hooks/useAppNotifications";
import { formatDistanceToNow } from "date-fns";

const typeColors: Record<string, string> = {
  task_due: "bg-warning/10 text-warning",
  focus_start: "bg-primary/10 text-primary",
  focus_end: "bg-success/10 text-success",
  habit: "bg-accent/10 text-accent",
  reflection: "bg-purple-500/10 text-purple-500",
  goal_deadline: "bg-destructive/10 text-destructive",
  info: "bg-muted text-muted-foreground",
};

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

export const NotificationCenter = ({ open, onClose }: NotificationCenterProps) => {
  const { data: notifications } = useAppNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllRead();
  const unreadCount = useUnreadCount();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed right-4 top-16 w-80 md:w-96 z-[100] max-h-[80vh] flex flex-col bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">{unreadCount}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()} className="text-xs h-7">
                  <CheckCheck className="w-3.5 h-3.5 mr-1" />Mark all read
                </Button>
              )}
              <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-lg"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {(!notifications || notifications.length === 0) && (
              <div className="p-8 text-center text-muted-foreground text-sm">No notifications yet</div>
            )}
            {notifications?.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.is_read && markRead.mutate(n.id)}
                className={cn(
                  "w-full text-left p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors",
                  !n.is_read && "bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", !n.is_read ? "bg-primary" : "bg-transparent")} />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", !n.is_read && "font-medium")}>{n.title}</p>
                    {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const NotificationBell = ({ onClick }: { onClick: () => void }) => {
  const unreadCount = useUnreadCount();
  return (
    <button onClick={onClick} className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
      <Bell className="w-5 h-5 text-muted-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};
