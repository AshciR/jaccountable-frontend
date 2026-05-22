import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import RelatedArticleCard from './RelatedArticleCard.svelte';
import type { Article } from '$lib/api/types';

const baseArticle: Article = {
	id: 'rel-test-00000000-0000-0000-0000-000000000001',
	url: 'https://jamaica-gleaner.com/article/related-test',
	title: 'Government Audit Uncovers Finance Ministry Irregularities',
	section: 'news',
	newsSource: 'JAMAICA_GLEANER',
	publishedDate: '2025-03-10T09:00:00Z',
	snippet: null,
	entities: ['Fritz Pinnock', 'Ministry of Finance', 'Auditor General'],
	classifications: [{ classifierType: 'CORRUPTION', confidenceScore: 0.88 }],
	fullText:
		'The Auditor General has released findings on the Ministry of Finance. Several irregularities were identified in the audit report. A third sentence that should not appear in the excerpt.'
};

describe('RelatedArticleCard', () => {
	it('should render the article title as a link to the detail page', () => {
		// Given: the component renders with an article
		render(RelatedArticleCard, { props: { article: baseArticle } });

		// When: the page loads

		// Then: should display the title as a link pointing to the article detail page
		const link = screen.getByRole('link', { name: baseArticle.title });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', `/articles/${baseArticle.id}`);
	});

	it('should show the first two sentences of fullText as the excerpt', () => {
		// Given: the component renders with an article that has fullText
		render(RelatedArticleCard, { props: { article: baseArticle } });

		// When: the page loads

		// Then: should display the first two sentences joined together
		expect(
			screen.getByText(
				'The Auditor General has released findings on the Ministry of Finance. Several irregularities were identified in the audit report.…'
			)
		).toBeInTheDocument();
	});

	it('should not show the third sentence in the excerpt', () => {
		// Given: the component renders with an article whose fullText has more than two sentences
		render(RelatedArticleCard, { props: { article: baseArticle } });

		// When: the page loads

		// Then: should not display the third sentence
		expect(screen.queryByText(/A third sentence that should not appear/)).not.toBeInTheDocument();
	});

	it('should not show an excerpt when fullText is absent', () => {
		// Given: the component renders with an article that has no fullText
		render(RelatedArticleCard, { props: { article: { ...baseArticle, fullText: undefined } } });

		// When: the page loads

		// Then: should not display any excerpt paragraph (text only found in fullText, not entity pills)
		expect(screen.queryByText(/released findings/)).not.toBeInTheDocument();
	});

	it('should render entity pills for each entity', () => {
		// Given: the component renders with an article that has entities
		render(RelatedArticleCard, { props: { article: baseArticle } });

		// When: the page loads

		// Then: should display each entity as a pill
		baseArticle.entities.forEach((entity) => {
			expect(screen.getByText(entity)).toBeInTheDocument();
		});
	});

	it('should not render entity pills when entities array is empty', () => {
		// Given: the component renders with an article that has no entities
		render(RelatedArticleCard, { props: { article: { ...baseArticle, entities: [] } } });

		// When: the page loads

		// Then: should not display any entity pills
		expect(screen.queryByText('Fritz Pinnock')).not.toBeInTheDocument();
	});

	it('should render the Jamaica Gleaner source logo', () => {
		// Given: the component renders with a Gleaner article
		render(RelatedArticleCard, { props: { article: baseArticle } });

		// When: the page loads

		// Then: should display the Gleaner logo and source name
		expect(screen.getByAltText('Jamaica Gleaner')).toBeInTheDocument();
		expect(screen.getByText('Jamaica Gleaner')).toBeInTheDocument();
	});

	it('should render the Jamaica Observer source logo', () => {
		// Given: the component renders with an Observer article
		render(RelatedArticleCard, {
			props: { article: { ...baseArticle, newsSource: 'JAMAICA_OBSERVER' } }
		});

		// When: the page loads

		// Then: should display the Observer logo and source name
		expect(screen.getByAltText('Jamaica Observer')).toBeInTheDocument();
		expect(screen.getByText('Jamaica Observer')).toBeInTheDocument();
	});
});
