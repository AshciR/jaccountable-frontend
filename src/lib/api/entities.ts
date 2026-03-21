import type { EntitySummary, EntityListResponse } from './types';
import { apiFetch } from './fetch';

export async function fetchTopEntities(): Promise<EntitySummary[]> {
	const response = await apiFetch('/api/v1/entities?sort=most_found&page_size=5');
	if (!response.ok) {
		return [];
	}
	const data: EntityListResponse = await response.json();
	return data.items;
}
