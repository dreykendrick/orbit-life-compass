import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { notificationService } from "@/services/NotificationService";
import { useRoutines } from "./useRoutines";
import { toast } from "sonner";

export const useNotifications = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { data: routines } = useRoutines();
  const isNative = Capacitor.isNativePlatform();

  // Initialize notifications on mount
  useEffect(() => {
    const init = async () => {
      if (!isNative) {
        setIsInitialized(true);
        return;
      }

      const granted = await notificationService.initialize();
      setHasPermission(granted);
      setIsInitialized(true);

      if (granted) {
        toast.success("Alarm notifications enabled!");
      } else {
        toast.error("Please enable notifications for alarms to work");
      }
    };

    init();
  }, [isNative]);

  // Sync all routine alarms when routines change
  useEffect(() => {
    const syncAlarms = async () => {
      if (!isInitialized || !hasPermission || !routines) return;

      for (const routine of routines) {
        if (routine.alarm_enabled && routine.is_active) {
          await notificationService.scheduleRoutineAlarm({
            id: routine.id,
            title: routine.title,
            description: routine.description || undefined,
            startTime: routine.start_time,
            frequency: routine.frequency,
            customDays: routine.custom_days || undefined,
          });
        }
      }

      const pendingCount = await notificationService.getPendingAlarms();
      console.log(`Synced ${pendingCount} alarm notifications`);
    };

    syncAlarms();
  }, [isInitialized, hasPermission, routines]);

  return {
    isNative,
    isInitialized,
    hasPermission,
  };
};
