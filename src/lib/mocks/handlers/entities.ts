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
			filtered = filtered.filter((entity) => entity.lastSeenDate >= since);
		}

		const sorted = [...filtered];
		if (sort === 'most_found') {
			sorted.sort((a, b) => b.articleCount - a.articleCount);
		} else {
			sorted.sort(
				(a, b) => new Date(b.lastSeenDate).getTime() - new Date(a.lastSeenDate).getTime()
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
				pageSize,
				totalResults,
				totalPages
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
