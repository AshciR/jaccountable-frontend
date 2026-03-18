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

export interface EntityQueryEcho {
	sort: 'latest' | 'most_found';
	since: string | null;
}

export interface Pagination {
	page: number;
	pageSize: number;
	totalResults: number;
	totalPages: number;
}

export interface EntityListResponse {
	data: EntitySummary[];
	pagination: Pagination;
	query: EntityQueryEcho;
}
