import { env } from '$env/dynamic/public';

const { PUBLIC_API_BASE_URL } = env;
import { getDistinctId, getSessionId, isInternalUser } from '$lib/utils/analytics';

function addAnalyticHeaders(headers: Headers): Headers {
	const next = new Headers(headers);
	const distinctId = getDistinctId();
	if (distinctId) next.set('X-PostHog-Distinct-Id', distinctId);
	const sessionId = getSessionId();
	if (sessionId) next.set('X-PostHog-Session-Id', sessionId);
	if (isInternalUser()) next.set('X-Internal-Request', 'true');
	return next;
}

export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
	const headers = addAnalyticHeaders(new Headers(init?.headers));

	const url =
		typeof input === 'string' && PUBLIC_API_BASE_URL ? `${PUBLIC_API_BASE_URL}${input}` : input;

	return fetch(url, { ...init, headers });
}
