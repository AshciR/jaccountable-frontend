import posthog from 'posthog-js';
import { browser } from '$app/environment';

export function isInternalUser(): boolean {
	if (!browser) return false;
	const { hostname } = window.location;
	return hostname.includes('localhost') || hostname === 'staging.jaccountable.org';
}

export function getDistinctId(): string | undefined {
	if (!browser) return undefined;
	return posthog.get_distinct_id();
}

export function trackEvent(eventName: string, properties: Record<string, unknown> = {}): void {
	if (!browser) return;

	posthog.capture(eventName, {
		environment: import.meta.env.MODE,
		is_internal: isInternalUser(),
		...properties
	});
}
