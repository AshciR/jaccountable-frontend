import type { ArticleSearchResponse, SearchOptions } from './types';
import { apiFetch } from './fetch';

export async function searchArticles({
	query,
	sortOrder = 'desc',
	pageSize = 5,
	page = 1
}: SearchOptions = {}): Promise<ArticleSearchResponse> {
	const params = new URLSearchParams({
		sort: 'published_date',
		order: sortOrder,
		page_size: String(pageSize),
		page: String(page),
		...(query ? { q: query } : {})
	});
	const response = await apiFetch(`/api/v1/articles?${params}`);
	return response.json();
}
