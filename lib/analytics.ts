import posthog from 'posthog-js';

export type AnalyticsEvent =
  | 'joke_viewed'
  | 'punchline_revealed'
  | 'props_given'
  | 'joke_groaned'
  | 'joke_stashed'
  | 'joke_unstashed'
  | 'joke_shared'
  | 'joke_skipped'
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'fathers_day_lead_capture'
  | 'dad_mode_toggled'
  | 'send_to_dad_clicked';

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  posthog.capture(event, properties);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (window as any).gtag === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gtag('event', event, properties);
  }
}
