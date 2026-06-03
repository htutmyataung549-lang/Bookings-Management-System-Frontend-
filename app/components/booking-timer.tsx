import { AlertTriangle, Timer } from "lucide-react";
import { useEffect, useState } from "react";

interface BookingTimerProps {
  initialSeconds: number;
  onTimeOut: () => void;
}

export default function BookingTimer({
  initialSeconds,
  onTimeOut,
}: BookingTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeOut();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onTimeOut]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isUrgent = timeLeft <= 60;

return (
    <div
      className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-sm font-medium transition-colors duration-300 ${
        isUrgent
          ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 animate-bounce" />
      ) : (
        <Timer className="w-4 h-4" />
      )}
      <span>
        {isUrgent ? "Hurry up! " : "Ticket held for you: "}
        <span className="font-mono font-bold text-base">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>{" "}
        minutes left
      </span>
    </div>
  );
}
