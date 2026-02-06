import posthog from 'posthog-js';
import { browser } from '$app/environment';

export function isInternalUser(): boolean {
	if (!browser) return false;
	return window.location.hostname.includes('localhost');
}

export function trackEvent(eventName: string, properties: Record<string, unknown> = {}): void {
	if (!browser) return;

	posthog.capture(eventName, {
		environment: import.meta.env.MODE,
		is_internal: isInternalUser(),
		...properties
	});
}
