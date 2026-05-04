import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

/**
 * Unified notification service.
 * - On native platforms (iOS/Android via Capacitor) → uses LocalNotifications,
 *   which fire even when the app is backgrounded or closed.
 * - On web (desktop / mobile browser / installed PWA) → uses the Web
 *   Notifications API, which only fires while the page is alive.
 */
class DesktopNotificationService {
  private permission: NotificationPermission = "default";
  private nativeGranted = false;
  private checkIntervals: ReturnType<typeof setInterval>[] = [];

  get isNative() {
    return Capacitor.isNativePlatform();
  }

  async initialize(): Promise<boolean> {
    if (this.isNative) {
      try {
        const status = await LocalNotifications.checkPermissions();
        let display = status.display;
        if (display !== "granted") {
          const req = await LocalNotifications.requestPermissions();
          display = req.display;
        }
        this.nativeGranted = display === "granted";
        return this.nativeGranted;
      } catch (e) {
        console.error("Native notification init failed:", e);
        return false;
      }
    }

    if (!("Notification" in window)) {
      console.log("Browser notifications not supported");
      return false;
    }
    this.permission = await Notification.requestPermission();
    return this.permission === "granted";
  }

  get isGranted() {
    return this.isNative ? this.nativeGranted : this.permission === "granted";
  }

  /**
   * Fire a notification immediately.
   * On native: schedules a local notification at "now" so the OS owns delivery.
   * On web: uses the standard Notification constructor.
   */
  send(title: string, options?: NotificationOptions & { id?: number }): void {
    if (this.isNative) {
      if (!this.nativeGranted) return;
      const id = options?.id ?? Math.floor(Math.random() * 1_000_000_000);
      LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body: options?.body ?? "",
            schedule: { at: new Date(Date.now() + 100) },
            smallIcon: "ic_stat_icon_config_sample",
            extra: options?.data,
          },
        ],
      }).catch((e) => console.error("Native notify failed:", e));
      return;
    }

    if (this.permission !== "granted") return;
    try {
      const notification = new Notification(title, {
        icon: "/orbit-logo.png",
        badge: "/orbit-logo.png",
        ...options,
      });
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (e) {
      console.error("Failed to send notification:", e);
    }
  }

  clearAllIntervals() {
    this.checkIntervals.forEach(clearInterval);
    this.checkIntervals = [];
  }
}

export const desktopNotificationService = new DesktopNotificationService();
