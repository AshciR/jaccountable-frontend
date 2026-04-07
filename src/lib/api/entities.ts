import type { EntitySummary, EntitySortOrder, EntityListResponse } from './types';
import { apiFetch } from './fetch';

export async function fetchTopEntities(
	sort: EntitySortOrder = 'most_found'
): Promise<EntitySummary[]> {
	const response = await apiFetch(`/api/v1/entities?sort=${sort}&page_size=8`);
	if (!response.ok) {
		return [];
	}
	const data: EntityListResponse = await response.json();
	return data.items;
}
