import { useEffect, useMemo, useState } from "react";

const DAY_MS = 24 * 60 * 60 * 1000;

export function useDayHue() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  const dayProgress = useMemo(() => (now % DAY_MS) / DAY_MS, [now]);

  return { dayProgress };
}
