import { describe, it, expect, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '$lib/mocks/server';
import { searchArticles } from './articles';

vi.mock('$env/dynamic/public', () => ({ env: { PUBLIC_API_BASE_URL: '' } }));
vi.mock('$lib/utils/analytics', () => ({
	getDistinctId: vi.fn(),
	getSessionId: vi.fn(),
	isInternalUser: vi.fn()
}));

function captureArticlesRequest() {
	let params: URLSearchParams;
	server.use(
		http.get('*/api/v1/articles', ({ request }) => {
			params = new URL(request.url).searchParams;
			return HttpResponse.json({ items: [], total: 0, page: 1, pageSize: 5, pages: 0 });
		})
	);
	return () => params;
}

describe('searchArticles', () => {
	it('should sort by published_date desc and limit to 5 when called with no options', async () => {
		// Given: no options provided
		const getParams = captureArticlesRequest();

		// When: fetching articles
		await searchArticles();

		// Then: should request sort=published_date, order=desc, page_size=5, page=1, no query
		const params = getParams();
		expect(params.get('sort')).toBe('published_date');
		expect(params.get('order')).toBe('desc');
		expect(params.get('page_size')).toBe('5');
		expect(params.get('page')).toBe('1');
		expect(params.get('q')).toBeNull();
	});

	it('should include the query param and sort by date desc when searching by query', async () => {
		// Given: a search query
		const getParams = captureArticlesRequest();

		// When: fetching articles with a query
		await searchArticles({ query: 'CMU' });

		// Then: should include q, sort=published_date, order=desc, page_size=5, page=1
		const params = getParams();
		expect(params.get('q')).toBe('CMU');
		expect(params.get('sort')).toBe('published_date');
		expect(params.get('order')).toBe('desc');
		expect(params.get('page_size')).toBe('5');
		expect(params.get('page')).toBe('1');
	});

	it('should pass the page param when specified', async () => {
		// Given: page 2 is requested
		const getParams = captureArticlesRequest();

		// When: fetching articles with page=2
		await searchArticles({ query: 'CMU', page: 2 });

		// Then: should include page=2 in the request
		expect(getParams().get('page')).toBe('2');
	});

	it('should encode special characters in the query param', async () => {
		// Given: a query with special characters
		const getParams = captureArticlesRequest();

		// When: fetching articles
		await searchArticles({ query: 'John & Jane' });

		// Then: should URL-encode the query
		expect(getParams().get('q')).toBe('John & Jane');
	});
});
