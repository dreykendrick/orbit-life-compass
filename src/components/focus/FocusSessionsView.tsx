import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Plus, Play, Clock, Target, Trash2, Square, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFocusSessions, useDeleteFocusSession, useUpdateFocusSession, FocusSession } from "@/hooks/useFocusSessions";
import { useGoals } from "@/hooks/useGoals";
import { AddFocusSessionDialog } from "./AddFocusSessionDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isPast, isFuture } from "date-fns";

const statusIcon: Record<string, React.ReactNode> = {
  scheduled: <Clock className="w-4 h-4 text-primary" />,
  in_progress: <Play className="w-4 h-4 text-warning" />,
  completed: <CheckCircle2 className="w-4 h-4 text-success" />,
  cancelled: <Square className="w-4 h-4 text-muted-foreground" />,
};

export const FocusSessionsView = () => {
  const { data: sessions, isLoading } = useFocusSessions();
  const { data: goals } = useGoals();
  const deleteSession = useDeleteFocusSession();
  const updateSession = useUpdateFocusSession();

  const getGoalTitle = (goalId: string | null) => {
    if (!goalId || !goals) return null;
    return goals.find((g) => g.id === goalId)?.title || null;
  };

  const handleStart = async (session: FocusSession, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateSession.mutateAsync({ id: session.id, status: "in_progress" });
  };

  const handleComplete = async (session: FocusSession, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateSession.mutateAsync({ id: session.id, status: "completed" });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this session?")) await deleteSession.mutateAsync(id);
  };

  const upcoming = sessions?.filter((s) => s.status === "scheduled") || [];
  const active = sessions?.filter((s) => s.status === "in_progress") || [];
  const past = sessions?.filter((s) => s.status === "completed" || s.status === "cancelled") || [];

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
            <span>Focus Sessions</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 md:mt-2">Schedule deep work sessions and stay productive.</p>
        </div>
        <AddFocusSessionDialog />
      </motion.div>

      {isLoading && (
        <div className="space-y-3">{[1, 2].map((i) => <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)}</div>
      )}

      {!isLoading && (!sessions || sessions.length === 0) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No focus sessions yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">Schedule focused work sessions to boost your productivity.</p>
          <AddFocusSessionDialog>
            <Button className="gap-2"><Plus className="w-4 h-4" />Schedule Your First Session</Button>
          </AddFocusSessionDialog>
        </motion.div>
      )}

      {!isLoading && sessions && sessions.length > 0 && (
        <div className="space-y-6">
          {active.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-warning flex items-center gap-2"><Play className="w-5 h-5" />Active</h2>
              {active.map((session) => (
                <SessionCard key={session.id} session={session} getGoalTitle={getGoalTitle} onComplete={handleComplete} onDelete={handleDelete} />
              ))}
            </div>
          )}
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Upcoming</h2>
              {upcoming.map((session) => (
                <SessionCard key={session.id} session={session} getGoalTitle={getGoalTitle} onStart={handleStart} onDelete={handleDelete} />
              ))}
            </div>
          )}
          {past.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-muted-foreground">Past</h2>
              {past.slice(0, 10).map((session) => (
                <SessionCard key={session.id} session={session} getGoalTitle={getGoalTitle} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SessionCard = ({
  session,
  getGoalTitle,
  onStart,
  onComplete,
  onDelete,
}: {
  session: FocusSession;
  getGoalTitle: (id: string | null) => string | null;
  onStart?: (s: FocusSession, e: React.MouseEvent) => void;
  onComplete?: (s: FocusSession, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}) => {
  const goalTitle = getGoalTitle(session.goal_id);
  return (
    <Card variant="interactive" className={cn(session.status === "completed" && "opacity-60")}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0">{statusIcon[session.status]}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{session.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>{format(new Date(session.start_time), "MMM d, h:mm a")}</span>
              <span>{session.duration_minutes}min</span>
              {goalTitle && <span className="flex items-center gap-1"><Target className="w-3 h-3" />{goalTitle}</span>}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onStart && session.status === "scheduled" && (
              <Button size="sm" variant="outline" onClick={(e) => onStart(session, e)} className="h-7 text-xs">Start</Button>
            )}
            {onComplete && session.status === "in_progress" && (
              <Button size="sm" variant="outline" onClick={(e) => onComplete(session, e)} className="h-7 text-xs">Done</Button>
            )}
            <button className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors" onClick={(e) => onDelete(session.id, e)}>
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
