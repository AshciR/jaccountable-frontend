import type { EntitySummary } from '$lib/api/types';

export const mockEntities: EntitySummary[] = [
	{
		name: 'CMU',
		normalizedName: 'cmu',
		articleCount: 45,
		lastSeenDate: '2025-11-18T09:15:00Z'
	},
	{
		name: 'Auditor General',
		normalizedName: 'auditor_general',
		articleCount: 38,
		lastSeenDate: '2025-11-25T10:00:00Z'
	},
	{
		name: 'Integrity Commission',
		normalizedName: 'integrity_commission',
		articleCount: 32,
		lastSeenDate: '2025-11-20T08:30:00Z'
	},
	{
		name: 'Public Defender',
		normalizedName: 'public_defender',
		articleCount: 27,
		lastSeenDate: '2025-11-22T13:45:00Z'
	},
	{
		name: 'Ministry of Finance',
		normalizedName: 'ministry_of_finance',
		articleCount: 21,
		lastSeenDate: '2025-11-20T08:30:00Z'
	}
];
