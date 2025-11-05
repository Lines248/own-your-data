export type EventName = "tuned_in" | "muted" | "volume_changed";

export interface AnalyticsEvent {
  name: EventName;
  payload?: Record<string, unknown>;
  timestamp: number;
}

const listeners: Array<(e: AnalyticsEvent) => void> = [];

export function track(name: EventName, payload?: Record<string, unknown>) {
  const event: AnalyticsEvent = { name, payload, timestamp: Date.now() };
  if (typeof window !== "undefined") {
    console.log("[analytics]", event);
  }
  listeners.forEach((fn) => fn(event));
}

export function subscribeAnalytics(fn: (e: AnalyticsEvent) => void) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}