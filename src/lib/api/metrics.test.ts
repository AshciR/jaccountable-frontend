import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '$lib/mocks/server';
import { fetchMetrics } from './metrics';

vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_API_BASE_URL: '' } }));
vi.mock('$lib/utils/analytics', () => ({
	getDistinctId: vi.fn(),
	getSessionId: vi.fn(),
	isInternalUser: vi.fn()
}));

describe('fetchMetrics', () => {
	it('should request /api/v1/metrics and return the parsed response', async () => {
		// Given: the API returns metrics (handled by the default MSW handler)

		// When: fetching metrics
		const result = await fetchMetrics();

		// Then: should return the parsed metrics body
		expect(result).toEqual({ articleCount: 12345, entityCount: 1200 });
	});

	it('should return null when the response is not ok', async () => {
		// Given: the API returns a 500
		server.use(http.get('*/api/v1/metrics', () => new HttpResponse(null, { status: 500 })));

		// When: fetching metrics
		const result = await fetchMetrics();

		// Then: should return null
		expect(result).toBeNull();
	});
});
