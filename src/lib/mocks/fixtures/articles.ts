import type { Article } from '../types';

export const mockArticles: Article[] = [
	{
		id: 'a3f5e8c0-e29b-41d4-a716-446655440001',
		url: 'https://jamaica-gleaner.com/article/news/20251118/court-rejects-claims-nullity-reid-cmu-fraud-case-trial-proceed',
		title: 'Court Rejects Claims of Nullity in Reid CMU Fraud Case, Trial to Proceed',
		section: 'news',
		published_date: '2025-11-18T09:15:00Z',
		snippet:
			'The <mark>court</mark> has rejected arguments for nullity in the high-profile fraud case involving former Caribbean Maritime University (CMU) president, Professor Fritz Pinnock, and others. The trial will proceed as scheduled.',
		entities: [
			'Fritz Pinnock',
			'Caribbean Maritime University',
			'CMU',
			'Major General Antony Anderson',
			'Financial Investigations Division'
		]
	},
	{
		id: 'b7c2d9f1-f3a4-42e5-b827-557766551112',
		url: 'https://jamaica-gleaner.com/article/news/20251115/previous-cmu-related-article',
		title: 'CMU Fraud Investigation Continues',
		section: 'news',
		published_date: '2025-11-15T14:30:00Z',
		snippet:
			'Investigations into alleged financial irregularities at the <mark>Caribbean Maritime University</mark> continue as authorities examine procurement processes.',
		entities: ['Caribbean Maritime University', 'CMU', 'Major General Antony Anderson']
	}
];
