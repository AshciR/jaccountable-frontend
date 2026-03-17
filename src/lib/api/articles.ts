import type { Article, ArticleSearchResponse } from './types';

export async function searchArticles(query?: string): Promise<Article[]> {
	const url = query
		? `/api/v1/articles?q=${encodeURIComponent(query)}`
		: '/api/v1/articles?sort=published_date&order=desc&page_size=3';
	const response = await fetch(url);
	const data: ArticleSearchResponse = await response.json();
	return data.items;
}
