import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { useTasks } from "./useTasks";
import { useFocusSessions } from "./useFocusSessions";
import { useReminders } from "./useReminders";
import { useGoals } from "./useGoals";
import { useCreateNotification } from "./useAppNotifications";
import { desktopNotificationService } from "@/services/DesktopNotificationService";
import { isToday, isBefore, addMinutes, differenceInMinutes, parseISO, isWithinInterval, addDays } from "date-fns";

export const useNotificationEngine = () => {
  const { user } = useAuth();
  const { data: tasks } = useTasks();
  const { data: sessions } = useFocusSessions();
  const { data: reminders } = useReminders();
  const { data: goals } = useGoals();
  const createNotification = useCreateNotification();
  const checkedRef = useRef<Set<string>>(new Set());
  const initRef = useRef(false);

  // Request browser notification permission on mount
  useEffect(() => {
    if (!initRef.current) {
      desktopNotificationService.initialize();
      initRef.current = true;
    }
  }, []);

  // Check for due tasks
  useEffect(() => {
    if (!tasks || !user) return;
    const now = new Date();
    tasks.forEach((task) => {
      if (task.status === "completed" || !task.due_date) return;
      const due = new Date(task.due_date);
      const diffMin = differenceInMinutes(due, now);
      const key = `task_due_${task.id}_${task.due_date}`;
      if (diffMin <= 30 && diffMin >= -5 && !checkedRef.current.has(key)) {
        checkedRef.current.add(key);
        const title = `📋 Task due: ${task.title}`;
        const body = diffMin > 0 ? `Due in ${diffMin} minutes` : "Due now!";
        desktopNotificationService.send(title, { body, tag: key });
        createNotification.mutate({ title, body, type: "task_due", linked_type: "task", linked_id: task.id });
      }
    });
  }, [tasks, user]);

  // Check for focus session starts/ends
  useEffect(() => {
    if (!sessions || !user) return;
    const now = new Date();
    sessions.forEach((session) => {
      if (session.status === "completed" || session.status === "cancelled") return;
      const start = new Date(session.start_time);
      const end = addMinutes(start, session.duration_minutes);
      const startDiff = differenceInMinutes(start, now);
      const endDiff = differenceInMinutes(end, now);

      const startKey = `focus_start_${session.id}`;
      if (startDiff <= 5 && startDiff >= -2 && !checkedRef.current.has(startKey)) {
        checkedRef.current.add(startKey);
        const title = `⚡ Focus session starting: ${session.title}`;
        const body = startDiff > 0 ? `Starting in ${startDiff} minutes` : "Starting now!";
        desktopNotificationService.send(title, { body, tag: startKey });
        createNotification.mutate({ title, body, type: "focus_start", linked_type: "focus_session", linked_id: session.id });
      }

      const endKey = `focus_end_${session.id}`;
      if (endDiff <= 2 && endDiff >= -2 && !checkedRef.current.has(endKey)) {
        checkedRef.current.add(endKey);
        const title = `✅ Focus session ending: ${session.title}`;
        const body = "Great work! Time to wrap up.";
        desktopNotificationService.send(title, { body, tag: endKey });
        createNotification.mutate({ title, body, type: "focus_end", linked_type: "focus_session", linked_id: session.id });
      }
    });
  }, [sessions, user]);

  // Check for reminder times
  useEffect(() => {
    if (!reminders || !user) return;
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const todayKey = now.toISOString().slice(0, 10);

    reminders.forEach((reminder) => {
      if (!reminder.is_active) return;
      const key = `reminder_${reminder.id}_${todayKey}`;
      if (checkedRef.current.has(key)) return;
      const reminderTime = reminder.reminder_time.slice(0, 5);
      if (reminderTime === currentTime) {
        checkedRef.current.add(key);
        const title = `🔔 ${reminder.title}`;
        const body = reminder.description || "Time for your reminder!";
        desktopNotificationService.send(title, { body, tag: key });
        createNotification.mutate({ title, body, type: "habit", linked_type: reminder.linked_type || undefined, linked_id: reminder.linked_id || undefined });
      }
    });
  }, [reminders, user]);

  // Check for approaching goal deadlines
  useEffect(() => {
    if (!goals || !user) return;
    const now = new Date();
    goals.forEach((goal) => {
      if (!goal.is_active || !goal.target_date) return;
      const deadline = new Date(goal.target_date);
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const key = `goal_deadline_${goal.id}_${daysLeft}`;
      if ((daysLeft === 3 || daysLeft === 1 || daysLeft === 0) && !checkedRef.current.has(key)) {
        checkedRef.current.add(key);
        const title = `🎯 Goal deadline: ${goal.title}`;
        const body = daysLeft === 0 ? "Deadline is today!" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} remaining`;
        desktopNotificationService.send(title, { body, tag: key });
        createNotification.mutate({ title, body, type: "goal_deadline", linked_type: "goal", linked_id: goal.id });
      }
    });
  }, [goals, user]);

  // Periodic check interval
  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger re-evaluation by dependency changes - the data hooks auto-refresh
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Daily reflection reminder at 8pm
  useEffect(() => {
    if (!user) return;
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const key = `reflection_${todayKey}`;
    if (now.getHours() === 20 && now.getMinutes() === 0 && !checkedRef.current.has(key)) {
      checkedRef.current.add(key);
      const title = "📖 Time for your daily reflection";
      const body = "Take a moment to review your day and set intentions for tomorrow.";
      desktopNotificationService.send(title, { body, tag: key });
      createNotification.mutate({ title, body, type: "reflection" });
    }
  }, [user]);
};
