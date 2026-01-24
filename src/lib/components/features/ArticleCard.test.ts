import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ArticleCard from './ArticleCard.svelte';
import type { Article } from '$lib/api/types';

const gleanerArticle: Article = {
	id: 'test-gleaner-1',
	url: 'https://jamaica-gleaner.com/article/test',
	title: 'Test Gleaner Article Title',
	section: 'news',
	news_source: 'JAMAICA_GLEANER',
	published_date: '2025-01-15T10:30:00Z',
	snippet: 'This is a <mark>test</mark> snippet with highlighted text.',
	entities: ['Entity One', 'Entity Two', 'Entity Three'],
	classifications: [{ classifierType: 'CORRUPTION', confidence: 0.92 }]
};

const observerArticle: Article = {
	id: 'test-observer-1',
	url: 'https://jamaica-observer.com/article/test',
	title: 'Test Observer Article Title',
	section: 'politics',
	news_source: 'JAMAICA_OBSERVER',
	published_date: '2025-01-14T08:00:00Z',
	snippet: 'Observer article snippet without highlights.',
	entities: ['Person A', 'Organization B'],
	classifications: [{ classifierType: 'FRAUD', confidence: 0.78 }]
};

const unknownSourceArticle: Article = {
	id: 'test-unknown-1',
	url: 'https://other-news.com/article/test',
	title: 'Test Unknown Source Article',
	section: 'news',
	news_source: 'OTHER_SOURCE',
	published_date: '2025-01-13T12:00:00Z',
	snippet: 'Article from an unknown source.',
	entities: ['Entity X'],
	classifications: [{ classifierType: 'MISCONDUCT', confidence: 0.85 }]
};

/**
 * Helper function to assert all core article card content is displayed correctly.
 * Validates title, category badge, confidence score, entities, and source link.
 */
function assertArticleCardContent(article: Article) {
	// Title displayed
	expect(screen.getByText(article.title)).toBeInTheDocument();

	// Category badge from classifications
	if (article.classifications.length > 0) {
		const classifierType = article.classifications[0].classifierType.toLowerCase();
		expect(screen.getByText(classifierType)).toBeInTheDocument();
	}

	// Confidence score
	if (article.classifications.length > 0) {
		const confidenceDisplay = (article.classifications[0].confidence * 10).toFixed(1);
		expect(screen.getByText(confidenceDisplay)).toBeInTheDocument();
		expect(screen.getByText('Confidence')).toBeInTheDocument();
	}

	// Excerpt section label displayed
	expect(screen.getByText('Excerpt')).toBeInTheDocument();

	// Entity badges in Mentioned section
	article.entities.forEach((entity) => {
		expect(screen.getByText(entity)).toBeInTheDocument();
	});

	// Original Article link with correct URL
	const link = screen.getByRole('link', { name: 'Read original article' });
	expect(link).toBeInTheDocument();
	expect(link).toHaveAttribute('href', article.url);
	expect(link).toHaveAttribute('target', '_blank');
	expect(link).toHaveAttribute('rel', 'noopener noreferrer');

	// Source logo displayed
	const sourceName =
		article.news_source === 'JAMAICA_GLEANER'
			? 'Jamaica Gleaner'
			: article.news_source === 'JAMAICA_OBSERVER'
				? 'Jamaica Observer'
				: 'Source';
	expect(screen.getByAltText(sourceName)).toBeInTheDocument();
}

describe('ArticleCard', () => {
	it('should display all article card content correctly (Gleaner source)', () => {
		// Given: an article from Jamaica Gleaner
		render(ArticleCard, { props: { article: gleanerArticle } });

		// When: the component renders

		// Then: should display all article card content correctly
		assertArticleCardContent(gleanerArticle);

		// And: should display Gleaner logo
		expect(screen.getByAltText('Jamaica Gleaner')).toBeInTheDocument();
	});

	it('should display all article card content correctly (Observer source)', () => {
		// Given: an article from Jamaica Observer
		render(ArticleCard, { props: { article: observerArticle } });

		// When: the component renders

		// Then: should display all article card content correctly
		assertArticleCardContent(observerArticle);

		// And: should display Observer logo
		expect(screen.getByAltText('Jamaica Observer')).toBeInTheDocument();
	});

	it('should display fallback logo for unknown news source', () => {
		// Given: an article from an unknown source
		render(ArticleCard, { props: { article: unknownSourceArticle } });

		// When: the component renders

		// Then: should display all article card content correctly
		assertArticleCardContent(unknownSourceArticle);

		// And: should display fallback logo with generic alt text
		expect(screen.getByAltText('Source')).toBeInTheDocument();
	});

	it('should highlight marked words with correct styling', () => {
		// Given: an article with marked words in the snippet
		const articleWithMarkedWords: Article = {
			...gleanerArticle,
			snippet: 'The <mark>investigation</mark> revealed <mark>evidence</mark> of wrongdoing.'
		};
		render(ArticleCard, { props: { article: articleWithMarkedWords } });

		// When: the component renders

		// Then: should display highlighted words with bg-green-100 class
		const highlightedInvestigation = screen.getByText('investigation');
		const highlightedEvidence = screen.getByText('evidence');

		expect(highlightedInvestigation).toHaveClass('bg-green-100');
		expect(highlightedEvidence).toHaveClass('bg-green-100');
	});

	it('should handle empty entities array', () => {
		// Given: an article with no entities
		const articleWithNoEntities: Article = {
			...gleanerArticle,
			entities: []
		};
		render(ArticleCard, { props: { article: articleWithNoEntities } });

		// When: the component renders

		// Then: should not display the Mentioned section
		expect(screen.queryByText('Mentioned')).not.toBeInTheDocument();

		// And: should still display other content
		expect(screen.getByText(articleWithNoEntities.title)).toBeInTheDocument();
	});

	it('should handle empty classifications array', () => {
		// Given: an article with no classifications
		const articleWithNoClassifications: Article = {
			...gleanerArticle,
			classifications: []
		};
		render(ArticleCard, { props: { article: articleWithNoClassifications } });

		// When: the component renders

		// Then: should not display confidence or category badge
		expect(screen.queryByText('Confidence')).not.toBeInTheDocument();
		expect(screen.queryByText('corruption')).not.toBeInTheDocument();

		// And: should still display other content
		expect(screen.getByText(articleWithNoClassifications.title)).toBeInTheDocument();
	});
});
