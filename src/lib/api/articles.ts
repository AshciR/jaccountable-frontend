import type { Article, ArticleSearchResponse, SearchOptions } from './types';
import { apiFetch } from './fetch';

export async function searchArticles({
	query,
	sortOrder = 'desc',
	pageSize = 3
}: SearchOptions = {}): Promise<Article[]> {
	const params = new URLSearchParams({
		sort: 'published_date',
		order: sortOrder,
		// When searching by query, page_size is handled server-side; when browsing latest, limit to pageSize
		...(query ? { q: query } : { page_size: String(pageSize) })
	});
	const response = await apiFetch(`/api/v1/articles?${params}`);
	const data: ArticleSearchResponse = await response.json();
	return data.items;
}
