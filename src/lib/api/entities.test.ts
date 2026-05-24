import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '$lib/mocks/server';
import { fetchTopEntities } from './entities';

vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_API_BASE_URL: '' } }));
vi.mock('$lib/utils/analytics', () => ({
	getDistinctId: vi.fn(),
	getSessionId: vi.fn(),
	isInternalUser: vi.fn()
}));

function captureEntitiesRequest() {
	let params: URLSearchParams;
	server.use(
		http.get('*/api/v1/entities', ({ request }) => {
			params = new URL(request.url).searchParams;
			return HttpResponse.json({ items: [], total: 0, page: 1, pageSize: 8, pages: 0 });
		})
	);
	return () => params;
}

describe('fetchTopEntities', () => {
	it('should default to most_found sort with page_size=8', async () => {
		// Given: no sort specified
		const getParams = captureEntitiesRequest();

		// When: fetching top entities
		await fetchTopEntities();

		// Then: should request sort=most_found and page_size=8
		expect(getParams().get('sort')).toBe('most_found');
		expect(getParams().get('page_size')).toBe('8');
	});

	it('should use the provided sort order', async () => {
		// Given: latest sort requested
		const getParams = captureEntitiesRequest();

		// When: fetching with sort=latest
		await fetchTopEntities('latest');

		// Then: should pass sort=latest
		expect(getParams().get('sort')).toBe('latest');
	});

	it('should return the items array from the response', async () => {
		// Given: the API returns entities (handled by the default MSW handler)

		// When: fetching top entities
		const result = await fetchTopEntities('most_found');

		// Then: should return only the items array, sorted by article count descending
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toHaveProperty('name');
		expect(result[0]).toHaveProperty('articleCount');
		for (let i = 1; i < result.length; i++) {
			expect(result[i - 1].articleCount).toBeGreaterThanOrEqual(result[i].articleCount);
		}
	});

	it('should return an empty array when the response is not ok', async () => {
		// Given: the API returns a 500
		server.use(http.get('*/api/v1/entities', () => new HttpResponse(null, { status: 500 })));

		// When: fetching top entities
		const result = await fetchTopEntities();

		// Then: should return an empty array
		expect(result).toEqual([]);
	});
});
