import { getDistinctId, isInternalUser } from '$lib/utils/analytics';

export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
	const headers = new Headers(init?.headers);
	const distinctId = getDistinctId();
	if (distinctId) headers.set('X-PostHog-Distinct-Id', distinctId);
	if (isInternalUser()) headers.set('X-Internal-Request', 'true');
	return fetch(input, { ...init, headers });
}
