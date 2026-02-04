import { http, HttpResponse, delay } from 'msw';
import type { SearchResponse } from '$lib/api/types';
import { mockArticles } from '../fixtures/articles';

export const articleHandlers = [
	http.get<never, never, SearchResponse>('/api/v1/articles/search', async ({ request }) => {
		const url = new URL(request.url);
		const q = url.searchParams.get('q');
		const entity = url.searchParams.get('entity');
		const fromDate = url.searchParams.get('from_date');
		const toDate = url.searchParams.get('to_date');
		const page = parseInt(url.searchParams.get('page') || '1', 10);
		const pageSize = parseInt(url.searchParams.get('page_size') || '20', 10);

		let filtered = mockArticles;

		if (q) {
			const query = q.toLowerCase();
			filtered = filtered.filter(
				(article) =>
					article.title.toLowerCase().includes(query) ||
					article.snippet.toLowerCase().includes(query)
			);
		}

		if (entity) {
			const entityLower = entity.toLowerCase();
			filtered = filtered.filter((article) =>
				article.entities.some((e) => e.toLowerCase().includes(entityLower))
			);
		}

		if (fromDate) {
			filtered = filtered.filter((article) => article.published_date >= fromDate);
		}

		if (toDate) {
			filtered = filtered.filter((article) => article.published_date <= toDate);
		}

		const sort = url.searchParams.get('sort');
		const order = url.searchParams.get('order') || 'asc';

		if (sort === 'published_date') {
			filtered = [...filtered].sort((a, b) => {
				const dateA = new Date(a.published_date).getTime();
				const dateB = new Date(b.published_date).getTime();
				return order === 'desc' ? dateB - dateA : dateA - dateB;
			});
		}

		const totalResults = filtered.length;
		const totalPages = Math.ceil(totalResults / pageSize);
		const startIndex = (page - 1) * pageSize;
		const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

		const response: SearchResponse = {
			data: paginatedData,
			pagination: {
				page,
				page_size: pageSize,
				total_results: totalResults,
				total_pages: totalPages
			},
			query: {
				q,
				from_date: fromDate,
				to_date: toDate,
				entity
			}
		};

		if (!import.meta.env.TEST) {
			await delay(500);
		}

		return HttpResponse.json(response);
	})
];
