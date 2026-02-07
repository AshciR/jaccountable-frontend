import type { Article, SearchResponse } from './types';

export async function searchArticles(query?: string): Promise<Article[]> {
	const url = query
		? `/api/v1/articles/search?q=${encodeURIComponent(query)}`
		: '/api/v1/articles/search?sort=published_date&order=desc&page_size=3';
	const response = await fetch(url);
	const data: SearchResponse = await response.json();
	return data.data;
}
