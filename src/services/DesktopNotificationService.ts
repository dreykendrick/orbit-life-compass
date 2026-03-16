class DesktopNotificationService {
  private permission: NotificationPermission = "default";
  private checkIntervals: ReturnType<typeof setInterval>[] = [];

  async initialize(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("Browser notifications not supported");
      return false;
    }
    this.permission = await Notification.requestPermission();
    return this.permission === "granted";
  }

  get isGranted() {
    return this.permission === "granted";
  }

  send(title: string, options?: NotificationOptions): void {
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
