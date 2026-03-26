import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { getDistinctId, isInternalUser } from '$lib/utils/analytics';

export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
	const headers = new Headers(init?.headers);
	const distinctId = getDistinctId();
	if (distinctId) headers.set('X-PostHog-Distinct-Id', distinctId);
	if (isInternalUser()) headers.set('X-Internal-Request', 'true');

	const url =
		typeof input === 'string' && PUBLIC_API_BASE_URL ? `${PUBLIC_API_BASE_URL}${input}` : input;

	return fetch(url, { ...init, headers });
}
