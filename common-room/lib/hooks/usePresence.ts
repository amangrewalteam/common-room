import { useEffect, useMemo, useState } from "react";
import { createPresenceController, PresenceState } from "../usePresence";

export function usePresence(roomId: string) {
  const controller = useMemo(() => createPresenceController({ roomId }), [roomId]);
  const [state, setState] = useState<PresenceState>({
    status: "connecting",
    roomId,
    sessionId: "initial",
    count: 0,
    lastHeartbeatAt: null,
  });

  useEffect(() => {
    const unsub = controller.subscribe(setState);
    controller.start();
    return () => {
      unsub();
      controller.stop();
    };
  }, [controller]);

  return state;
}
