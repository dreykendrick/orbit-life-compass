import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Smile, Meh, Frown, Star, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTodayReflection, useReflections, useUpsertReflection } from "@/hooks/useDailyReflections";
import { format } from "date-fns";

const moodOptions = [
  { value: 1, icon: Frown, label: "Tough", color: "text-destructive" },
  { value: 2, icon: Meh, label: "Okay", color: "text-warning" },
  { value: 3, icon: Smile, label: "Good", color: "text-primary" },
  { value: 4, icon: Star, label: "Great", color: "text-success" },
  { value: 5, icon: Sparkles, label: "Amazing", color: "text-accent" },
];

export const ReflectionsView = () => {
  const { data: todayReflection } = useTodayReflection();
  const { data: pastReflections } = useReflections();
  const upsertReflection = useUpsertReflection();

  const [mood, setMood] = useState<number | null>(todayReflection?.mood || null);
  const [accomplishments, setAccomplishments] = useState(todayReflection?.accomplishments || "");
  const [challenges, setChallenges] = useState(todayReflection?.challenges || "");
  const [tomorrowGoals, setTomorrowGoals] = useState(todayReflection?.tomorrow_goals || "");
  const [gratitude, setGratitude] = useState(todayReflection?.gratitude || "");

  // Sync state when data loads
  useState(() => {
    if (todayReflection) {
      setMood(todayReflection.mood);
      setAccomplishments(todayReflection.accomplishments || "");
      setChallenges(todayReflection.challenges || "");
      setTomorrowGoals(todayReflection.tomorrow_goals || "");
      setGratitude(todayReflection.gratitude || "");
    }
  });

  const handleSave = async () => {
    await upsertReflection.mutateAsync({
      reflection_date: format(new Date(), "yyyy-MM-dd"),
      mood,
      accomplishments: accomplishments.trim() || null,
      challenges: challenges.trim() || null,
      tomorrow_goals: tomorrowGoals.trim() || null,
      gratitude: gratitude.trim() || null,
    });
  };

  const otherReflections = pastReflections?.filter(
    (r) => r.reflection_date !== format(new Date(), "yyyy-MM-dd")
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
          <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-primary shrink-0" />
          <span>Daily Reflection</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1 md:mt-2">Take a moment to review your day and set intentions for tomorrow.</p>
      </motion.div>

      {/* Today's Reflection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card variant="glow">
          <CardContent className="p-4 md:p-6 space-y-5">
            <h2 className="font-semibold text-lg">Today — {format(new Date(), "MMMM d, yyyy")}</h2>

            {/* Mood */}
            <div>
              <Label className="mb-2 block">How are you feeling?</Label>
              <div className="flex gap-2">
                {moodOptions.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all flex-1",
                        mood === m.value
                          ? "border-primary bg-primary/10"
                          : "border-transparent bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      <Icon className={cn("w-6 h-6", m.color)} />
                      <span className="text-[10px] font-medium">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>What did you accomplish today?</Label>
              <Textarea value={accomplishments} onChange={(e) => setAccomplishments(e.target.value)} placeholder="List your wins, big or small..." className="mt-1.5" />
            </div>

            <div>
              <Label>What challenges did you face?</Label>
              <Textarea value={challenges} onChange={(e) => setChallenges(e.target.value)} placeholder="Any obstacles or difficulties..." className="mt-1.5" />
            </div>

            <div>
              <Label>What are your goals for tomorrow?</Label>
              <Textarea value={tomorrowGoals} onChange={(e) => setTomorrowGoals(e.target.value)} placeholder="Set your intentions for tomorrow..." className="mt-1.5" />
            </div>

            <div>
              <Label>What are you grateful for?</Label>
              <Textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="Something you're thankful for..." className="mt-1.5" />
            </div>

            <Button onClick={handleSave} className="w-full" disabled={upsertReflection.isPending}>
              {upsertReflection.isPending ? "Saving..." : todayReflection ? "Update Reflection" : "Save Reflection"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Past Reflections */}
      {otherReflections && otherReflections.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Past Reflections</h2>
          {otherReflections.map((reflection) => {
            const moodItem = moodOptions.find((m) => m.value === reflection.mood);
            const MoodIcon = moodItem?.icon;
            return (
              <Card key={reflection.id} variant="interactive">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {MoodIcon && <MoodIcon className={cn("w-5 h-5", moodItem?.color)} />}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{format(new Date(reflection.reflection_date), "EEEE, MMMM d")}</p>
                      {reflection.accomplishments && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{reflection.accomplishments}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
