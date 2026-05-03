export interface Classification {
	classifierType: string;
	confidenceScore: number;
	reasoning?: string;
}

export interface Article {
	id: string;
	url: string;
	title: string;
	section: string;
	newsSource: string;
	publishedDate: string;
	snippet: string;
	entities: string[];
	classifications: Classification[];
	fullText?: string;
}

export interface ArticleSearchResponse {
	items: Article[];
	total: number;
	page: number;
	pageSize: number;
	pages: number;
}

export interface ErrorResponse {
	error: string;
	message: string;
	details?: Record<string, unknown>;
}

export interface EntitySummary {
	name: string;
	normalizedName: string;
	articleCount: number;
	lastSeenDate: string;
}

export type EntitySortOrder = 'most_found' | 'latest';

export type ArticleSortOrder = 'asc' | 'desc';
export type ArticleSortBy = 'published_date' | 'title' | 'relevance';

export interface SearchOptions {
	query?: string;
	sortOrder?: ArticleSortOrder;
	sortBy?: ArticleSortBy;
	pageSize?: number;
}

export interface EntityListResponse {
	items: EntitySummary[];
	total: number;
	page: number;
	pageSize: number;
	pages: number;
}
