import type { Article } from '$lib/api/types';

export const mockArticles: Article[] = [
	{
		id: 'a3f5e8c0-e29b-41d4-a716-446655440001',
		url: 'https://jamaica-gleaner.com/article/news/20251118/court-rejects-claims-nullity-reid-cmu-fraud-case-trial-proceed',
		title: 'Court Rejects Claims of Nullity in Reid CMU Fraud Case, Trial to Proceed',
		section: 'news',
		news_source: 'JAMAICA_GLEANER',
		published_date: '2025-11-18T09:15:00Z',
		snippet:
			'The court has rejected arguments for nullity in the high-profile fraud case involving former <mark>Caribbean Maritime University (CMU)</mark> president, Professor Fritz Pinnock, and others. The trial will proceed as scheduled.',
		entities: [
			'Fritz Pinnock',
			'Caribbean Maritime University',
			'CMU',
			'Major General Antony Anderson',
			'Financial Investigations Division'
		],
		classifications: [{ classifierType: 'CORRUPTION', confidence: 0.92 }],
		full_text: `KINGSTON, Jamaica — The Supreme Court on Monday delivered a significant ruling in the ongoing fraud case involving former Caribbean Maritime University officials.
Defence attorneys had filed motions arguing that procedural irregularities should render the charges null and void.
The court has rejected arguments for nullity in the high-profile fraud case involving former Caribbean Maritime University (CMU) president, Professor Fritz Pinnock, and others. The trial will proceed as scheduled.
Justice Michael Thompson stated that the evidence presented did not support claims of prosecutorial misconduct.
The Financial Investigations Division welcomed the ruling, noting that years of investigative work will now proceed to trial.`
	},
	{
		id: 'b7c2d9f1-f3a4-42e5-b827-557766551112',
		url: 'https://jamaica-observer.com/article/news/20251115/previous-cmu-related-article',
		title: 'CMU Fraud Investigation Continues',
		section: 'news',
		news_source: 'JAMAICA_OBSERVER',
		published_date: '2025-11-15T14:30:00Z',
		snippet:
			'Investigations into alleged financial irregularities at the <mark>Caribbean Maritime University</mark> continue as authorities examine procurement processes.',
		entities: ['Caribbean Maritime University', 'CMU', 'Major General Antony Anderson'],
		classifications: [{ classifierType: 'CORRUPTION', confidence: 0.85 }],
		full_text: `The Financial Investigations Division has expanded its probe into the Caribbean Maritime University scandal.
New documents obtained by investigators reveal a pattern of irregular procurement practices spanning several years.
Investigations into alleged financial irregularities at the Caribbean Maritime University continue as authorities examine procurement processes.
Major General Antony Anderson confirmed that additional persons of interest have been identified.
The university's board has pledged full cooperation with the ongoing investigation.`
	},
	{
		id: 'c8d3e0a2-g4b5-53f6-c938-668877662223',
		url: 'https://jamaica-gleaner.com/article/news/20251110/cmu-board-meets-discuss-reforms',
		title: 'CMU Board Meets to Discuss Institutional Reforms',
		section: 'news',
		news_source: 'JAMAICA_GLEANER',
		published_date: '2025-11-10T11:00:00Z',
		snippet:
			'The <mark>CMU</mark> Board of Directors convened an emergency meeting to discuss governance reforms following recent controversies.',
		entities: ['Caribbean Maritime University', 'CMU', 'Ministry of Education'],
		classifications: [{ classifierType: 'GOVERNANCE', confidence: 0.79 }],
		full_text: `In the wake of ongoing legal proceedings, the Caribbean Maritime University is taking steps to restore public confidence.
Ministry of Education officials attended the session to provide oversight guidance.
The CMU Board of Directors convened an emergency meeting to discuss governance reforms following recent controversies.
Proposed changes include enhanced financial transparency and independent audit requirements.
Student representatives expressed cautious optimism about the proposed reforms during the meeting.`
	},
	{
		id: 'd9e4f1b3-h5c6-64g7-d049-779988773334',
		url: 'https://jamaica-observer.com/article/news/20251105/cmu-students-demand-transparency',
		title: 'CMU Students Demand Greater Transparency',
		section: 'news',
		news_source: 'JAMAICA_OBSERVER',
		published_date: '2025-11-05T08:45:00Z',
		snippet:
			'Students at <mark>Caribbean Maritime University</mark> staged a peaceful demonstration demanding greater transparency in university administration.',
		entities: ['Caribbean Maritime University', 'CMU', 'Student Union'],
		classifications: [{ classifierType: 'ACCOUNTABILITY', confidence: 0.79 }],
		full_text: `Tensions continue to mount at the Caribbean Maritime University as students voice their frustrations.
The Student Union organized the demonstration after weeks of planning and consultation with faculty supporters.
Students at Caribbean Maritime University staged a peaceful demonstration demanding greater transparency in university administration.
Protest signs called for the release of financial records and accountability for alleged mismanagement.
University security maintained a peaceful presence throughout the two-hour demonstration.`
	},
	{
		id: 'e0f5a2c4-i6d7-75h8-e150-880099884445',
		url: 'https://jamaica-gleaner.com/article/news/20251125/auditor-general-flags-irregularities-in-parish-council-spending',
		title: 'Auditor General Flags Irregularities in Parish Council Spending',
		section: 'news',
		news_source: 'JAMAICA_GLEANER',
		published_date: '2025-11-25T10:00:00Z',
		snippet:
			'The <mark>Auditor General</mark> has identified significant irregularities in spending by multiple parish councils across Jamaica, calling for immediate corrective action.',
		entities: [
			'Auditor General',
			'Ministry of Local Government',
			'Parish Councils',
			'Pamela Monroe Ellis'
		],
		classifications: [{ classifierType: 'CORRUPTION', confidence: 0.88 }],
		full_text: `A new report from the Auditor General's Department has raised alarm over financial management in Jamaica's parish councils.
The audit, covering the 2024-2025 fiscal year, found widespread non-compliance with procurement guidelines.
The Auditor General has identified significant irregularities in spending by multiple parish councils across Jamaica, calling for immediate corrective action.
Pamela Monroe Ellis stated that the findings reflect systemic weaknesses in local government oversight.
The Ministry of Local Government has promised to implement the report's recommendations within 90 days.`
	},
	{
		id: 'f1a6b3d5-j7e8-86i9-f261-991100995556',
		url: 'https://jamaica-observer.com/article/news/20251122/public-defender-calls-for-police-oversight-reform',
		title: 'Public Defender Calls for Police Oversight Reform',
		section: 'news',
		news_source: 'JAMAICA_OBSERVER',
		published_date: '2025-11-22T13:45:00Z',
		snippet:
			'The <mark>Public Defender</mark> has issued a formal recommendation urging the government to strengthen independent oversight of the Jamaica Constabulary Force.',
		entities: [
			'Public Defender',
			'Jamaica Constabulary Force',
			'INDECOM',
			'Ministry of National Security'
		],
		classifications: [{ classifierType: 'CORRUPTION', confidence: 0.91 }],
		full_text: `Concerns about police accountability have reached a critical point following several high-profile incidents.
The Office of the Public Defender released a comprehensive report examining gaps in the current oversight framework.
The Public Defender has issued a formal recommendation urging the government to strengthen independent oversight of the Jamaica Constabulary Force.
INDECOM officials have expressed support for the proposed reforms while noting resource constraints.
The Ministry of National Security acknowledged receipt of the recommendations and committed to a formal review.`
	},
	{
		id: 'a2b7c4e6-k8f9-97j0-a372-002211006667',
		url: 'https://jamaica-gleaner.com/article/news/20251120/integrity-commission-investigates-no-bid-contracts',
		title: 'Integrity Commission Investigates No-Bid Government Contracts',
		section: 'news',
		news_source: 'JAMAICA_GLEANER',
		published_date: '2025-11-20T08:30:00Z',
		snippet:
			'The <mark>Integrity Commission</mark> has launched an investigation into several government ministries over allegations of improperly awarded no-bid contracts.',
		entities: [
			'Integrity Commission',
			'Office of the Contractor General',
			'Ministry of Finance',
			'Cabinet Office'
		],
		classifications: [{ classifierType: 'CORRUPTION', confidence: 0.87 }],
		full_text: `Questions surrounding government procurement practices have prompted formal action from Jamaica's anti-corruption body.
Multiple whistleblower complaints triggered the investigation spanning three government ministries.
The Integrity Commission has launched an investigation into several government ministries over allegations of improperly awarded no-bid contracts.
The Office of the Contractor General confirmed that preliminary findings warrant a full statutory investigation.
The Cabinet Office declined to comment on ongoing investigations but reiterated its commitment to transparent procurement.`
	}
];
