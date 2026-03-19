import type { EntitySummary, EntityListResponse } from './types';

export async function fetchTopEntities(): Promise<EntitySummary[]> {
	const response = await fetch('/api/v1/entities?sort=most_found&page_size=5');
	if (!response.ok) {
		return [];
	}
	const data: EntityListResponse = await response.json();
	return data.items;
}
