import { http, HttpResponse, delay } from 'msw';
import type { EntityListResponse } from '$lib/api/types';
import { mockEntities } from '../fixtures/entities';

export const entityHandlers = [
	http.get<never, never, EntityListResponse>('/api/v1/entities', async ({ request }) => {
		const url = new URL(request.url);
		const sort = url.searchParams.get('sort') || 'latest';
		const pageSize = parseInt(url.searchParams.get('page_size') || '20', 10);
		const page = parseInt(url.searchParams.get('page') || '1', 10);
		const since = url.searchParams.get('since');

		let filtered = mockEntities;

		if (since) {
			filtered = filtered.filter((entity) => entity.last_seen_date >= since);
		}

		const sorted = [...filtered];
		if (sort === 'most_found') {
			sorted.sort((a, b) => b.article_count - a.article_count);
		} else {
			sorted.sort(
				(a, b) => new Date(b.last_seen_date).getTime() - new Date(a.last_seen_date).getTime()
			);
		}

		const totalResults = sorted.length;
		const totalPages = Math.ceil(totalResults / pageSize);
		const startIndex = (page - 1) * pageSize;
		const paginatedData = sorted.slice(startIndex, startIndex + pageSize);

		const response: EntityListResponse = {
			data: paginatedData,
			pagination: {
				page,
				page_size: pageSize,
				total_results: totalResults,
				total_pages: totalPages
			},
			query: {
				sort: sort as 'latest' | 'most_found',
				since
			}
		};

		if (!import.meta.env.TEST) {
			await delay(500);
		}

		return HttpResponse.json(response);
	})
];
