import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

export function isInternalHost(hostname: string): boolean {
	return hostname.includes('localhost') || hostname === 'staging.jaccountable.org';
}

export function isInternalUser(): boolean {
	if (!browser) return false;
	return isInternalHost(window.location.hostname);
}

export function getDistinctId(): string | undefined {
	if (!browser) return undefined;
	return posthog.get_distinct_id();
}

export function getSessionId(): string | undefined {
	if (!browser) return undefined;
	return posthog.get_session_id();
}

export function trackEvent(eventName: string, properties: Record<string, unknown> = {}): void {
	if (!browser) return;

	posthog.capture(eventName, {
		environment: env.PUBLIC_APP_ENV,
		is_internal: isInternalUser(),
		...properties
	});
}
