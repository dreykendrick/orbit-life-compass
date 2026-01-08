import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export interface RoutineAlarm {
  id: string;
  title: string;
  description?: string;
  startTime: string; // HH:mm format
  frequency: string;
  customDays?: number[];
}

class NotificationService {
  private isNative = Capacitor.isNativePlatform();

  async initialize(): Promise<boolean> {
    if (!this.isNative) {
      console.log('Notifications only available on native platforms');
      return false;
    }

    try {
      const permission = await LocalNotifications.requestPermissions();
      return permission.display === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  async scheduleRoutineAlarm(routine: RoutineAlarm): Promise<void> {
    if (!this.isNative) return;

    try {
      // Cancel existing notifications for this routine
      await this.cancelRoutineAlarm(routine.id);

      const [hours, minutes] = routine.startTime.split(':').map(Number);
      const now = new Date();
      
      // Create notification schedule based on frequency
      const notifications: ScheduleOptions['notifications'] = [];
      const notificationId = this.generateNotificationId(routine.id);

      if (routine.frequency === 'daily') {
        // Schedule for every day
        for (let i = 0; i < 7; i++) {
          const scheduleDate = new Date(now);
          scheduleDate.setDate(now.getDate() + i);
          scheduleDate.setHours(hours, minutes, 0, 0);
          
          if (scheduleDate > now) {
            notifications.push({
              id: notificationId + i,
              title: `⏰ ${routine.title}`,
              body: routine.description || 'Time for your routine!',
              schedule: {
                at: scheduleDate,
                repeats: true,
                every: 'day'
              },
              sound: 'beep.wav',
              actionTypeId: 'ROUTINE_ALARM'
            });
            break; // Only need one repeating notification
          }
        }
      } else if (routine.frequency === 'weekdays') {
        // Schedule for weekdays only (Mon-Fri)
        const weekdays = [1, 2, 3, 4, 5];
        weekdays.forEach((day, index) => {
          notifications.push({
            id: notificationId + index,
            title: `⏰ ${routine.title}`,
            body: routine.description || 'Time for your routine!',
            schedule: {
              on: {
                weekday: day + 1, // Capacitor uses 1-7 (Sun-Sat)
                hour: hours,
                minute: minutes
              },
              repeats: true
            },
            sound: 'beep.wav',
            actionTypeId: 'ROUTINE_ALARM'
          });
        });
      } else if (routine.frequency === 'weekends') {
        // Schedule for weekends only (Sat-Sun)
        const weekends = [0, 6];
        weekends.forEach((day, index) => {
          notifications.push({
            id: notificationId + index,
            title: `⏰ ${routine.title}`,
            body: routine.description || 'Time for your routine!',
            schedule: {
              on: {
                weekday: day === 0 ? 1 : 7, // Sunday = 1, Saturday = 7
                hour: hours,
                minute: minutes
              },
              repeats: true
            },
            sound: 'beep.wav',
            actionTypeId: 'ROUTINE_ALARM'
          });
        });
      } else if (routine.frequency === 'custom' && routine.customDays) {
        // Schedule for custom days
        routine.customDays.forEach((day, index) => {
          notifications.push({
            id: notificationId + index,
            title: `⏰ ${routine.title}`,
            body: routine.description || 'Time for your routine!',
            schedule: {
              on: {
                weekday: day + 1, // Convert 0-6 to 1-7
                hour: hours,
                minute: minutes
              },
              repeats: true
            },
            sound: 'beep.wav',
            actionTypeId: 'ROUTINE_ALARM'
          });
        });
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log(`Scheduled ${notifications.length} alarm(s) for routine: ${routine.title}`);
      }
    } catch (error) {
      console.error('Failed to schedule alarm:', error);
      throw error;
    }
  }

  async cancelRoutineAlarm(routineId: string): Promise<void> {
    if (!this.isNative) return;

    try {
      const baseId = this.generateNotificationId(routineId);
      // Cancel all possible notification IDs for this routine (up to 7 for daily schedules)
      const idsToCancel = Array.from({ length: 7 }, (_, i) => ({ id: baseId + i }));
      await LocalNotifications.cancel({ notifications: idsToCancel });
    } catch (error) {
      console.error('Failed to cancel alarm:', error);
    }
  }

  async cancelAllAlarms(): Promise<void> {
    if (!this.isNative) return;

    try {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }
    } catch (error) {
      console.error('Failed to cancel all alarms:', error);
    }
  }

  async getPendingAlarms(): Promise<number> {
    if (!this.isNative) return 0;

    try {
      const pending = await LocalNotifications.getPending();
      return pending.notifications.length;
    } catch (error) {
      console.error('Failed to get pending alarms:', error);
      return 0;
    }
  }

  private generateNotificationId(routineId: string): number {
    // Generate a stable numeric ID from the routine UUID
    let hash = 0;
    for (let i = 0; i < routineId.length; i++) {
      const char = routineId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % 1000000 * 10; // Multiply by 10 to leave room for day offsets
  }
}

export const notificationService = new NotificationService();
