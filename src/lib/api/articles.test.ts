import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./fetch', () => ({
	apiFetch: vi.fn()
}));

import { apiFetch } from './fetch';
import { searchArticles } from './articles';

const mockApiFetch = vi.mocked(apiFetch);

function makeResponse(items = []) {
	return new Response(
		JSON.stringify({ items, total: 0, page: 1, pageSize: 5, pages: 0 })
	) as Response;
}

describe('searchArticles', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockApiFetch.mockResolvedValue(makeResponse());
	});

	it('should sort by published_date desc and limit to 5 when called with no options', async () => {
		// Given: no options provided

		// When: fetching articles
		await searchArticles();

		// Then: should request sort=published_date, order=desc, page_size=5, page=1, no query
		const [url] = mockApiFetch.mock.calls[0];
		const params = new URL(url as string, 'http://localhost').searchParams;
		expect(params.get('sort')).toBe('published_date');
		expect(params.get('order')).toBe('desc');
		expect(params.get('page_size')).toBe('5');
		expect(params.get('page')).toBe('1');
		expect(params.get('q')).toBeNull();
	});

	it('should include the query param and sort by date desc when searching by query', async () => {
		// Given: a search query

		// When: fetching articles with a query
		await searchArticles({ query: 'CMU' });

		// Then: should include q, sort=published_date, order=desc, page_size=5, page=1
		const [url] = mockApiFetch.mock.calls[0];
		const params = new URL(url as string, 'http://localhost').searchParams;
		expect(params.get('q')).toBe('CMU');
		expect(params.get('sort')).toBe('published_date');
		expect(params.get('order')).toBe('desc');
		expect(params.get('page_size')).toBe('5');
		expect(params.get('page')).toBe('1');
	});

	it('should pass the page param when specified', async () => {
		// Given: page 2 is requested

		// When: fetching articles with page=2
		await searchArticles({ query: 'CMU', page: 2 });

		// Then: should include page=2 in the request
		const [url] = mockApiFetch.mock.calls[0];
		const params = new URL(url as string, 'http://localhost').searchParams;
		expect(params.get('page')).toBe('2');
	});

	it('should encode special characters in the query param', async () => {
		// Given: a query with special characters

		// When: fetching articles
		await searchArticles({ query: 'John & Jane' });

		// Then: should URL-encode the query
		const [url] = mockApiFetch.mock.calls[0];
		const params = new URL(url as string, 'http://localhost').searchParams;
		expect(params.get('q')).toBe('John & Jane');
	});
});
