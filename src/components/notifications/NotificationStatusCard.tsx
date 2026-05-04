import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, BellRing, Check } from "lucide-react";
import { desktopNotificationService } from "@/services/DesktopNotificationService";
import { useDnd } from "@/hooks/useDnd";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";

export const NotificationStatusCard = () => {
  const isNative = Capacitor.isNativePlatform();
  const [granted, setGranted] = useState(() => desktopNotificationService.isGranted);
  const [permission, setPermission] = useState<NotificationPermission>(
    !isNative && typeof Notification !== "undefined" ? Notification.permission : "default",
  );
  const { isDnd, enableDnd, disableDnd, reason } = useDnd();

  useEffect(() => {
    if (!isNative && typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
    setGranted(desktopNotificationService.isGranted);
  }, [isNative]);

  const requestPermission = async () => {
    const ok = await desktopNotificationService.initialize();
    setGranted(ok);
    if (!isNative && typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
    if (ok) {
      toast.success("Notifications enabled!");
      desktopNotificationService.send("✅ Notifications activated", {
        body: "You'll now receive alerts for reminders, tasks, and focus sessions.",
      });
    } else {
      toast.error(
        isNative
          ? "Permission denied. Enable notifications in your device settings."
          : "Permission denied. Enable notifications in your browser settings.",
      );
    }
  };

  const supported = isNative || typeof Notification !== "undefined";
  const isGranted = isNative ? granted : permission === "granted";
  const label = isNative ? "Mobile notifications" : "Desktop notifications";
  const statusText = !supported
    ? "Not supported on this device"
    : isGranted
    ? "Active — you'll receive alerts"
    : !isNative && permission === "denied"
    ? "Blocked — enable in browser settings"
    : "Not enabled yet";

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {permission === "granted" || isGranted ? (
                <BellRing className="w-4 h-4 text-primary" />
              ) : (
                <Bell className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground truncate">{statusText}</p>
            </div>
          </div>
          {supported && !isGranted && (
            <Button size="sm" onClick={requestPermission} className="shrink-0">
              Enable
            </Button>
          )}
          {isGranted && (
            <span className="text-xs text-success flex items-center gap-1 shrink-0">
              <Check className="w-3 h-3" /> On
            </span>
          )}
        </div>

        <div className="border-t border-border pt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <BellOff className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">Do Not Disturb</p>
              <p className="text-xs text-muted-foreground truncate">
                {isDnd
                  ? `Active${reason ? ` — ${reason}` : ""}. Desktop alerts are silenced.`
                  : "Silence desktop alerts during focus time"}
              </p>
            </div>
          </div>
          <Switch
            checked={isDnd}
            onCheckedChange={(v) => (v ? enableDnd("Manual") : disableDnd())}
          />
        </div>
      </CardContent>
    </Card>
  );
};
