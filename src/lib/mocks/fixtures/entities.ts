import type { EntitySummary } from '$lib/api/types';

export const mockEntities: EntitySummary[] = [
	{
		name: 'CMU',
		normalized_name: 'cmu',
		article_count: 45,
		last_seen_date: '2025-11-18T09:15:00Z'
	},
	{
		name: 'Auditor General',
		normalized_name: 'auditor_general',
		article_count: 38,
		last_seen_date: '2025-11-25T10:00:00Z'
	},
	{
		name: 'Integrity Commission',
		normalized_name: 'integrity_commission',
		article_count: 32,
		last_seen_date: '2025-11-20T08:30:00Z'
	},
	{
		name: 'Public Defender',
		normalized_name: 'public_defender',
		article_count: 27,
		last_seen_date: '2025-11-22T13:45:00Z'
	},
	{
		name: 'Ministry of Finance',
		normalized_name: 'ministry_of_finance',
		article_count: 21,
		last_seen_date: '2025-11-20T08:30:00Z'
	}
];
