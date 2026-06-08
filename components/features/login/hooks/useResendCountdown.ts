import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_DURATION_SECONDS = 59;

function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function useResendCountdown(durationSeconds = DEFAULT_DURATION_SECONDS) {
  const [countDown, setCountDown] = useState("01:00");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(durationSeconds);

  const clearCountdown = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(() => {
    clearCountdown();
    setIsResendDisabled(true);
    secondsRef.current = durationSeconds;

    intervalRef.current = setInterval(() => {
      setCountDown(formatCountdown(secondsRef.current));

      if (secondsRef.current <= 0) {
        setIsResendDisabled(false);
        setCountDown("");
        clearCountdown();
        return;
      }

      secondsRef.current -= 1;
    }, 1000);
  }, [clearCountdown, durationSeconds]);

  useEffect(() => clearCountdown, [clearCountdown]);

  return { countDown, isResendDisabled, startCountdown, clearCountdown };
}
