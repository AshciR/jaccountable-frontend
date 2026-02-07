export interface Classification {
	classifierType: string;
	confidence: number;
}

export interface Article {
	id: string;
	url: string;
	title: string;
	section: string;
	news_source: string;
	published_date: string;
	snippet: string;
	entities: string[];
	classifications: Classification[];
	full_text?: string;
}

export interface Pagination {
	page: number;
	page_size: number;
	total_results: number;
	total_pages: number;
}

export interface QueryInfo {
	q: string | null;
	from_date: string | null;
	to_date: string | null;
	entity: string | null;
	sort?: string | null;
	order?: string | null;
}

export interface SearchResponse {
	data: Article[];
	pagination: Pagination;
	query: QueryInfo;
}

export interface ErrorResponse {
	error: string;
	message: string;
	details?: Record<string, unknown>;
}

export interface EntitySummary {
	name: string;
	normalized_name: string;
	article_count: number;
	last_seen_date: string;
}

export interface EntityQueryEcho {
	sort: 'latest' | 'most_found';
	since: string | null;
}

export interface EntityListResponse {
	data: EntitySummary[];
	pagination: Pagination;
	query: EntityQueryEcho;
}
