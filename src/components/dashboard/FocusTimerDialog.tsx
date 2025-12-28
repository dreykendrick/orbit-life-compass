import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle, Pause, RotateCcw, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface FocusTimerDialogProps {
  children?: React.ReactNode;
}

export const FocusTimerDialog = ({ children }: FocusTimerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      toast.success("Focus session complete! Great work!");
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
  };

  const setDuration = (minutes: number) => {
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Focus Timer</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-6">
          {/* Timer display */}
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
              <span className="text-sm text-muted-foreground mt-1">
                {isRunning ? "Focusing..." : "Ready"}
              </span>
            </div>
          </div>

          {/* Duration presets */}
          <div className="flex gap-2">
            {[15, 25, 45, 60].map((mins) => (
              <Button
                key={mins}
                variant={selectedDuration === mins ? "default" : "outline"}
                size="sm"
                onClick={() => setDuration(mins)}
                disabled={isRunning}
              >
                {mins}m
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              disabled={timeLeft === selectedDuration * 60}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              onClick={toggleTimer}
              className="gap-2 min-w-32"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  {timeLeft === selectedDuration * 60 ? "Start" : "Resume"}
                </>
              )}
            </Button>
            {timeLeft === 0 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <CheckCircle className="w-5 h-5 text-success" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
