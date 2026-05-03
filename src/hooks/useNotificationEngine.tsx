import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { useTasks } from "./useTasks";
import { useFocusSessions } from "./useFocusSessions";
import { useReminders } from "./useReminders";
import { useGoals } from "./useGoals";
import { useCreateNotification } from "./useAppNotifications";
import { useDnd } from "./useDnd";
import { desktopNotificationService } from "@/services/DesktopNotificationService";
import { addMinutes, differenceInMinutes } from "date-fns";

export const useNotificationEngine = () => {
  const { user } = useAuth();
  const { data: tasks } = useTasks();
  const { data: sessions } = useFocusSessions();
  const { data: reminders } = useReminders();
  const { data: goals } = useGoals();
  const createNotification = useCreateNotification();
  const { isDnd } = useDnd();
  const checkedRef = useRef<Set<string>>(new Set());
  const initRef = useRef(false);
  const [tick, setTick] = useState(0);

  // Request browser notification permission on mount
  useEffect(() => {
    if (!initRef.current) {
      desktopNotificationService.initialize();
      initRef.current = true;
    }
  }, []);

  // Heartbeat every 30s so time-based checks re-evaluate
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper: send notification respecting DnD
  const dispatch = (
    title: string,
    body: string,
    type: string,
    tag: string,
    linked_type?: string,
    linked_id?: string,
    bypassDnd = false,
  ) => {
    // Always create the in-app notification (so users see history)
    createNotification.mutate({ title, body, type, linked_type, linked_id });
    // Suppress desktop notification when DnD is active, unless bypass
    if (isDnd && !bypassDnd) return;
    desktopNotificationService.send(title, { body, tag });
  };

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
        dispatch(title, body, "task_due", key, "task", task.id);
      }
    });
  }, [tasks, user, tick, isDnd]);

  // Focus session starts/ends — bypass DnD so user knows session ends
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
        dispatch(
          `⚡ Focus session starting: ${session.title}`,
          startDiff > 0 ? `Starting in ${startDiff} minutes` : "Starting now!",
          "focus_start",
          startKey,
          "focus_session",
          session.id,
          true,
        );
      }

      const endKey = `focus_end_${session.id}`;
      if (endDiff <= 2 && endDiff >= -2 && !checkedRef.current.has(endKey)) {
        checkedRef.current.add(endKey);
        dispatch(
          `✅ Focus session ending: ${session.title}`,
          "Great work! Time to wrap up.",
          "focus_end",
          endKey,
          "focus_session",
          session.id,
          true,
        );
      }
    });
  }, [sessions, user, tick]);

  // Reminders
  useEffect(() => {
    if (!reminders || !user) return;
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const todayKey = now.toISOString().slice(0, 10);

    reminders.forEach((reminder) => {
      if (!reminder.is_active) return;
      const key = `reminder_${reminder.id}_${todayKey}_${currentTime}`;
      if (checkedRef.current.has(key)) return;
      const reminderTime = reminder.reminder_time.slice(0, 5);
      // Match within current minute window
      if (reminderTime === currentTime) {
        checkedRef.current.add(key);
        dispatch(
          `🔔 ${reminder.title}`,
          reminder.description || "Time for your reminder!",
          "habit",
          key,
          reminder.linked_type || undefined,
          reminder.linked_id || undefined,
        );
      }
    });
  }, [reminders, user, tick, isDnd]);

  // Goal deadlines
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
        dispatch(
          `🎯 Goal deadline: ${goal.title}`,
          daysLeft === 0 ? "Deadline is today!" : `${daysLeft} day${daysLeft > 1 ? "s" : ""} remaining`,
          "goal_deadline",
          key,
          "goal",
          goal.id,
        );
      }
    });
  }, [goals, user, tick, isDnd]);

  // Daily reflection at 8pm
  useEffect(() => {
    if (!user) return;
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);
    const key = `reflection_${todayKey}`;
    if (now.getHours() === 20 && now.getMinutes() < 5 && !checkedRef.current.has(key)) {
      checkedRef.current.add(key);
      dispatch(
        "📖 Time for your daily reflection",
        "Take a moment to review your day and set intentions for tomorrow.",
        "reflection",
        key,
      );
    }
  }, [user, tick, isDnd]);
};
