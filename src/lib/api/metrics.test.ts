import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./fetch', () => ({
	apiFetch: vi.fn()
}));

import { apiFetch } from './fetch';
import { fetchMetrics } from './metrics';

const mockApiFetch = vi.mocked(apiFetch);

describe('fetchMetrics', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should request /api/v1/metrics and return the parsed response', async () => {
		// Given: the API returns metrics
		mockApiFetch.mockResolvedValue(
			new Response(JSON.stringify({ articleCount: 12345, entityCount: 1200 }))
		);

		// When: fetching metrics
		const result = await fetchMetrics();

		// Then: should call the metrics endpoint and return the parsed body
		expect(mockApiFetch).toHaveBeenCalledWith('/api/v1/metrics');
		expect(result).toEqual({ articleCount: 12345, entityCount: 1200 });
	});

	it('should return null when the response is not ok', async () => {
		// Given: the API returns a 500
		mockApiFetch.mockResolvedValue(new Response('error', { status: 500 }));

		// When: fetching metrics
		const result = await fetchMetrics();

		// Then: should return null
		expect(result).toBeNull();
	});
});
