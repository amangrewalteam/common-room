import { AppState, AppStateStatus } from "react-native";

// Simple, stable-ish device/session id (no native modules needed)
function makeSessionId() {
  return `sess_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export type PresenceStatus = "connecting" | "online" | "offline";

export type PresenceState = {
  status: PresenceStatus;
  roomId: string;
  sessionId: string;
  // For now: only “you”. Later: list of members in the room.
  count: number;
  lastHeartbeatAt: number | null;
};

type Options = {
  roomId: string;
  heartbeatMs?: number; // default 15s
};

export function createPresenceController({ roomId, heartbeatMs = 15000 }: Options) {
  let sessionId = makeSessionId();
  let status: PresenceStatus = "connecting";
  let lastHeartbeatAt: number | null = null;

  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let appStateSub: { remove: () => void } | null = null;

  const listeners = new Set<(s: PresenceState) => void>();

  function emit() {
    const state: PresenceState = {
      status,
      roomId,
      sessionId,
      count: status === "online" ? 1 : 0,
      lastHeartbeatAt,
    };
    listeners.forEach((fn) => fn(state));
  }

  function heartbeat() {
    // In real implementation: write/update presence in backend
    lastHeartbeatAt = Date.now();
    status = "online";
    emit();
  }

  function start() {
    status = "connecting";
    emit();

    // Immediately mark present
    heartbeat();

    heartbeatTimer = setInterval(heartbeat, heartbeatMs);

    const onAppStateChange = (next: AppStateStatus) => {
      if (next === "active") {
        // Re-assert presence immediately when returning
        heartbeat();
        if (!heartbeatTimer) heartbeatTimer = setInterval(heartbeat, heartbeatMs);
      } else {
        // Background: stop heartbeating, mark offline locally
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        status = "offline";
        emit();
      }
    };

    appStateSub = AppState.addEventListener("change", onAppStateChange);
  }

  function stop() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (appStateSub) {
      appStateSub.remove();
      appStateSub = null;
    }
    status = "offline";
    emit();
  }

  function subscribe(fn: (s: PresenceState) => void) {
    listeners.add(fn);
    // push current state immediately
    fn({
      status,
      roomId,
      sessionId,
      count: status === "online" ? 1 : 0,
      lastHeartbeatAt,
    });
    return () => listeners.delete(fn);
  }

  return { start, stop, subscribe };
}
