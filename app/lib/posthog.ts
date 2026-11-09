import posthog from "posthog-js";

export const initPostHog = () => {
  if (typeof window !== "undefined") {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
    if (key && !posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        person_profiles: "identified_only",
        capture_pageview: true,
      });
    }
  }
};

export const captureEvent = (
  eventName: string,
  properties?: Record<string, unknown>,
) => {
  if (typeof window !== "undefined") {
    initPostHog();
    try {
      if (posthog.__loaded) {
        posthog.capture(eventName, properties);
      }
      console.log(`[PostHog] Captured "${eventName}":`, properties);
    } catch (err) {
      console.warn("[PostHog] capture error:", err);
    }
  }
};
