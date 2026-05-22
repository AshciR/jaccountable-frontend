import type {
	Article,
	ArticleSearchResponse,
	RelatedArticlesResponse,
	SearchOptions
} from './types';
import { apiFetch } from './fetch';

export async function fetchArticleById(id: string): Promise<Article> {
	const response = await apiFetch(`/api/v1/articles/${id}`);
	return response.json();
}

export async function fetchRelatedArticles(id: string): Promise<Article[]> {
	const response = await apiFetch(`/api/v1/articles/${id}/related`);
	if (!response.ok) return [];
	const data: RelatedArticlesResponse = await response.json();
	return data.articles ?? [];
}

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
