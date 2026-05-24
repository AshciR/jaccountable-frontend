import type { Cookies } from '@sveltejs/kit';
import { env as publicEnv } from '$env/dynamic/public';
import { isInternalHost } from '$lib/utils/analytics';

const { PUBLIC_POSTHOG_KEY } = publicEnv;

type PostHogCookie = {
	distinct_id?: string;
	$sesid?: [number, string, number];
};

function readPostHogCookie(cookies: Cookies): PostHogCookie | null {
	if (!PUBLIC_POSTHOG_KEY) return null;
	const raw = cookies.get(`ph_${PUBLIC_POSTHOG_KEY}_posthog`);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as PostHogCookie;
	} catch {
		return null;
	}
}

export function buildAnalyticHeaders(cookies: Cookies, url: URL): Headers {
	const headers = new Headers();
	const ph = readPostHogCookie(cookies);
	if (ph?.distinct_id) headers.set('X-PostHog-Distinct-Id', ph.distinct_id);
	const sessionId = ph?.$sesid?.[1];
	if (sessionId) headers.set('X-PostHog-Session-Id', sessionId);
	if (isInternalHost(url.hostname)) headers.set('X-Internal-Request', 'true');
	return headers;
}
