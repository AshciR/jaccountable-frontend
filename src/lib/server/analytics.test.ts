import { describe, it, expect, vi } from 'vitest';
import type { Cookies } from '@sveltejs/kit';

vi.mock('$env/dynamic/public', () => ({
	env: { PUBLIC_POSTHOG_KEY: 'phc_test_key' }
}));

import { buildAnalyticHeaders } from './analytics';

function makeCookies(cookieValue?: string): Cookies {
	return {
		get: vi.fn().mockReturnValue(cookieValue)
	} as unknown as Cookies;
}

const validCookie = JSON.stringify({
	distinct_id: 'distinct-abc',
	$sesid: [1779656806803, 'session-xyz', 1779652372426]
});

describe('buildAnalyticHeaders', () => {
	it('should set distinct ID and session ID headers from the PostHog cookie', () => {
		// Given: a PostHog cookie with both IDs
		const cookies = makeCookies(validCookie);

		// When: building analytic headers
		const headers = buildAnalyticHeaders(cookies, new URL('https://jaccountable.org/'));

		// Then: should include both header values and read from the namespaced cookie
		expect(headers.get('X-PostHog-Distinct-Id')).toBe('distinct-abc');
		expect(headers.get('X-PostHog-Session-Id')).toBe('session-xyz');
		expect(cookies.get).toHaveBeenCalledWith('ph_phc_test_key_posthog');
	});

	it('should set X-Internal-Request when hostname is localhost', () => {
		// Given: a request from localhost
		const cookies = makeCookies(validCookie);

		// When: building analytic headers
		const headers = buildAnalyticHeaders(cookies, new URL('http://localhost:5173/'));

		// Then: should flag the request as internal
		expect(headers.get('X-Internal-Request')).toBe('true');
	});

	it('should set X-Internal-Request when hostname is staging.jaccountable.org', () => {
		// Given: a request from the staging domain
		const cookies = makeCookies(validCookie);

		// When: building analytic headers
		const headers = buildAnalyticHeaders(cookies, new URL('https://staging.jaccountable.org/'));

		// Then: should flag the request as internal
		expect(headers.get('X-Internal-Request')).toBe('true');
	});

	it('should not set X-Internal-Request for production hostname', () => {
		// Given: a request from the production domain
		const cookies = makeCookies(validCookie);

		// When: building analytic headers
		const headers = buildAnalyticHeaders(cookies, new URL('https://jaccountable.org/'));

		// Then: should not flag the request as internal
		expect(headers.get('X-Internal-Request')).toBeNull();
	});

	it('should omit PostHog headers when the cookie is absent', () => {
		// Given: no PostHog cookie on the request (e.g. first visit)
		const cookies = makeCookies(undefined);

		// When: building analytic headers
		const headers = buildAnalyticHeaders(cookies, new URL('https://jaccountable.org/'));

		// Then: should not include any PostHog headers
		expect(headers.get('X-PostHog-Distinct-Id')).toBeNull();
		expect(headers.get('X-PostHog-Session-Id')).toBeNull();
	});

	it('should omit PostHog headers when the cookie is malformed JSON', () => {
		// Given: a PostHog cookie that cannot be parsed
		const cookies = makeCookies('not-json-{');

		// When: building analytic headers
		const headers = buildAnalyticHeaders(cookies, new URL('https://jaccountable.org/'));

		// Then: should silently omit the headers rather than throwing
		expect(headers.get('X-PostHog-Distinct-Id')).toBeNull();
		expect(headers.get('X-PostHog-Session-Id')).toBeNull();
	});

	it('should omit session ID when the cookie has distinct_id but no $sesid', () => {
		// Given: a PostHog cookie missing the session entry
		const cookies = makeCookies(JSON.stringify({ distinct_id: 'distinct-abc' }));

		// When: building analytic headers
		const headers = buildAnalyticHeaders(cookies, new URL('https://jaccountable.org/'));

		// Then: should set the distinct ID but not the session ID
		expect(headers.get('X-PostHog-Distinct-Id')).toBe('distinct-abc');
		expect(headers.get('X-PostHog-Session-Id')).toBeNull();
	});
});
