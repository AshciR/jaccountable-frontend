import { http, HttpResponse, delay } from 'msw';
import type { Article, ArticleSearchResponse, ErrorResponse } from '$lib/api/types';
import { mockArticles } from '../fixtures/articles';

export const articleHandlers = [
	http.get<{ id: string }, never, Article | ErrorResponse>(
		'*/api/v1/articles/:id',
		async ({ params }) => {
			const article = mockArticles.find((a) => a.id === params.id);

			if (!article) {
				return HttpResponse.json(
					{ error: 'NOT_FOUND', message: 'Article not found' },
					{ status: 404 }
				);
			}

			if (!import.meta.env.TEST) {
				await delay(300);
			}

			return HttpResponse.json(article);
		}
	),

	http.get<never, never, ArticleSearchResponse>('*/api/v1/articles', async ({ request }) => {
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
					(article.snippet?.toLowerCase().includes(query) ?? false) ||
					article.entities.some((e) => e.toLowerCase().includes(query))
			);
		}

		if (entity) {
			const entityLower = entity.toLowerCase();
			filtered = filtered.filter((article) =>
				article.entities.some((e) => e.toLowerCase().includes(entityLower))
			);
		}

		if (fromDate) {
			filtered = filtered.filter((article) => article.publishedDate >= fromDate);
		}

		if (toDate) {
			filtered = filtered.filter((article) => article.publishedDate <= toDate);
		}

		const sort = url.searchParams.get('sort');
		const order = url.searchParams.get('order') || 'asc';

		if (sort === 'published_date') {
			filtered = [...filtered].sort((a, b) => {
				const dateA = new Date(a.publishedDate).getTime();
				const dateB = new Date(b.publishedDate).getTime();
				return order === 'desc' ? dateB - dateA : dateA - dateB;
			});
		}

		const total = filtered.length;
		const pages = Math.ceil(total / pageSize);
		const startIndex = (page - 1) * pageSize;
		const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

		const response: ArticleSearchResponse = {
			items: paginatedData,
			total,
			page,
			pageSize,
			pages
		};

		if (!import.meta.env.TEST) {
			await delay(500);
		}

		return HttpResponse.json(response);
	})
];
