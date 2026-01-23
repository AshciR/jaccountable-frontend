export interface Article {
	id: string;
	url: string;
	title: string;
	section: string;
	published_date: string;
	snippet: string;
	entities: string[];
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
