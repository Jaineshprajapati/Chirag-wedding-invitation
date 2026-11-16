import { useEffect, useState } from "react";
import { timeLeft } from "../utils/date";

/** Ticks once per second, aligned to the wall-clock second. "pending" until mounted. */
export function useCountdown(iso) {
  const [state, setState] = useState("pending");
  useEffect(() => {
    if (!iso) {
      setState(null);
      return;
    }
    let timer = 0;
    const tick = () => {
      const now = Date.now();
      setState(timeLeft(iso, now));
      timer = window.setTimeout(tick, 1000 - (now % 1000) + 5);
    };
    tick();
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        window.clearTimeout(timer);
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [iso]);
  return state;
}
