import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$env/dynamic/public', () => ({
	env: { PUBLIC_API_BASE_URL: '' }
}));

vi.mock('$lib/utils/analytics', () => ({
	getDistinctId: vi.fn(),
	isInternalUser: vi.fn()
}));

vi.mock('$app/environment', () => ({
	browser: true
}));

import { getDistinctId, isInternalUser } from '$lib/utils/analytics';
import { apiFetch } from './fetch';

const mockGetDistinctId = vi.mocked(getDistinctId);
const mockIsInternalUser = vi.mocked(isInternalUser);

describe('apiFetch', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		global.fetch = vi.fn().mockResolvedValue(new Response());
	});

	it('should inject X-PostHog-Distinct-Id header when a distinct ID is available', async () => {
		// Given: PostHog has assigned a distinct ID
		mockGetDistinctId.mockReturnValue('abc-123');
		mockIsInternalUser.mockReturnValue(false);

		// When: making an API request
		await apiFetch('/api/v1/articles');

		// Then: should send the distinct ID header
		const [, init] = vi.mocked(fetch).mock.calls[0];
		const headers = new Headers(init?.headers);
		expect(headers.get('X-PostHog-Distinct-Id')).toBe('abc-123');
	});

	it('should not inject X-PostHog-Distinct-Id header when distinct ID is unavailable', async () => {
		// Given: PostHog has not yet assigned a distinct ID (e.g. SSR)
		mockGetDistinctId.mockReturnValue(undefined);
		mockIsInternalUser.mockReturnValue(false);

		// When: making an API request
		await apiFetch('/api/v1/articles');

		// Then: should not include the header
		const [, init] = vi.mocked(fetch).mock.calls[0];
		const headers = new Headers(init?.headers);
		expect(headers.get('X-PostHog-Distinct-Id')).toBeNull();
	});

	it('should inject X-Internal-Request header when user is internal', async () => {
		// Given: the request originates from an internal user
		mockGetDistinctId.mockReturnValue(undefined);
		mockIsInternalUser.mockReturnValue(true);

		// When: making an API request
		await apiFetch('/api/v1/articles');

		// Then: should flag the request as internal
		const [, init] = vi.mocked(fetch).mock.calls[0];
		const headers = new Headers(init?.headers);
		expect(headers.get('X-Internal-Request')).toBe('true');
	});

	it('should not inject X-Internal-Request header when user is not internal', async () => {
		// Given: the request originates from an external user
		mockGetDistinctId.mockReturnValue(undefined);
		mockIsInternalUser.mockReturnValue(false);

		// When: making an API request
		await apiFetch('/api/v1/articles');

		// Then: should not include the internal header
		const [, init] = vi.mocked(fetch).mock.calls[0];
		const headers = new Headers(init?.headers);
		expect(headers.get('X-Internal-Request')).toBeNull();
	});

	it('should forward other init options unchanged', async () => {
		// Given: a request with a custom method and body
		mockGetDistinctId.mockReturnValue(undefined);
		mockIsInternalUser.mockReturnValue(false);

		// When: making an API request with custom options
		await apiFetch('/api/v1/articles', { method: 'POST', body: 'payload' });

		// Then: should preserve the custom options
		const [, init] = vi.mocked(fetch).mock.calls[0];
		expect(init?.method).toBe('POST');
		expect(init?.body).toBe('payload');
	});
});
