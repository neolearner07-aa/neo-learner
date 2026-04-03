"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  duration?: number;
  onTimeUp: () => void;
};

export default function Timer({
  duration = 30,
  onTimeUp,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  return (
    <div className="text-center text-sm text-gray-400">
      ⏱️ Time Left:{" "}
      <span className="text-white font-semibold">{timeLeft}s</span>
    </div>
  );
}