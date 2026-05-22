import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ArticleDetailView from './ArticleDetailView.svelte';
import type { Article } from '$lib/api/types';

const gleanerArticle: Article = {
	id: 'a3f5e8c0-e29b-41d4-a716-446655440001',
	url: 'https://jamaica-gleaner.com/article/news/test',
	title: 'Court Rejects Claims of Nullity in Fraud Case',
	section: 'news',
	newsSource: 'JAMAICA_GLEANER',
	publishedDate: '2025-11-18T09:15:00Z',
	snippet: 'The court has rejected arguments for nullity in the high-profile fraud case.',
	entities: ['Fritz Pinnock', 'Caribbean Maritime University', 'Financial Investigations Division'],
	classifications: [
		{
			classifierType: 'CORRUPTION',
			confidenceScore: 0.92,
			reasoning: 'Article covers criminal fraud charges against government officials.'
		}
	],
	fullText:
		'First paragraph about the court ruling.\n\nSecond paragraph with more detail on the case.\n\nThird paragraph concluding the story.'
};

const observerArticle: Article = {
	...gleanerArticle,
	id: 'b7c2d9f1-f3a4-42e5-b827-557766551112',
	url: 'https://jamaica-observer.com/article/news/test',
	newsSource: 'JAMAICA_OBSERVER',
	classifications: [
		{ classifierType: 'FRAUD', confidenceScore: 0.78, reasoning: 'Article covers financial fraud.' }
	]
};

const unknownSourceArticle: Article = {
	...gleanerArticle,
	newsSource: 'OTHER_SOURCE'
};

describe('ArticleDetailView', () => {
	it('should render the article title as a heading', () => {
		// Given: the component renders with an article
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display the title as an h1
		expect(
			screen.getByRole('heading', { level: 1, name: gleanerArticle.title })
		).toBeInTheDocument();
	});

	it('should render entity pills with Mentioned heading', () => {
		// Given: the component renders with an article that has entities
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display the Mentioned heading
		expect(screen.getByText('Mentioned')).toBeInTheDocument();

		// And: should display each entity
		gleanerArticle.entities.forEach((entity) => {
			expect(screen.getByText(entity)).toBeInTheDocument();
		});
	});

	it('should not render the Mentioned section when entities array is empty', () => {
		// Given: the component renders with an article that has no entities
		render(ArticleDetailView, { props: { article: { ...gleanerArticle, entities: [] } } });

		// When: the page loads

		// Then: should not display the Mentioned section
		expect(screen.queryByText('Mentioned')).not.toBeInTheDocument();
	});

	it('should render full text paragraphs when fullText is present', () => {
		// Given: the component renders with an article that has fullText
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display each paragraph
		expect(screen.getByText('First paragraph about the court ruling.')).toBeInTheDocument();
		expect(screen.getByText('Second paragraph with more detail on the case.')).toBeInTheDocument();
		expect(screen.getByText('Third paragraph concluding the story.')).toBeInTheDocument();
	});

	it('should render fallback text when fullText is absent', () => {
		// Given: the component renders with an article that has no fullText
		render(ArticleDetailView, { props: { article: { ...gleanerArticle, fullText: undefined } } });

		// When: the page loads

		// Then: should display the fallback message
		expect(screen.getByText('Full article text is not available.')).toBeInTheDocument();
	});

	it('should render the read original article link with correct attributes', () => {
		// Given: the component renders with an article
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display the link pointing to the original article URL
		const link = screen.getByRole('link', { name: 'Read original article →' });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', gleanerArticle.url);
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('should render the back to articles link pointing to /#search', () => {
		// Given: the component renders with an article
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display a back link to the search section
		const backLink = screen.getByRole('link', { name: '← Back to articles' });
		expect(backLink).toBeInTheDocument();
		expect(backLink).toHaveAttribute('href', '/#search');
	});

	it('should render the classification badge and confidence pill', () => {
		// Given: the component renders with an article that has a classification
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display the classification badge in lowercase
		expect(screen.getByTestId('source-header-classifier-type')).toHaveTextContent('corruption');

		// And: should display the certainty pill with the correct score
		expect(screen.getByTestId('source-header-confidence')).toHaveTextContent('92%');
	});

	it('should not render badge or certainty pill when classifications is empty', () => {
		// Given: the component renders with an article with no classifications
		render(ArticleDetailView, { props: { article: { ...gleanerArticle, classifications: [] } } });

		// When: the page loads

		// Then: should not display a badge or certainty pill
		expect(screen.queryByText('corruption')).not.toBeInTheDocument();
		expect(screen.queryByText('Certainty')).not.toBeInTheDocument();
	});

	it('should render the Jamaica Gleaner source logo', () => {
		// Given: the component renders with a Gleaner article
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display the Gleaner logo and source name
		expect(screen.getByAltText('Jamaica Gleaner')).toBeInTheDocument();
		expect(screen.getByText('Jamaica Gleaner')).toBeInTheDocument();
	});

	it('should render the Jamaica Observer source logo', () => {
		// Given: the component renders with an Observer article
		render(ArticleDetailView, { props: { article: observerArticle } });

		// When: the page loads

		// Then: should display the Observer logo and source name
		expect(screen.getByAltText('Jamaica Observer')).toBeInTheDocument();
		expect(screen.getByText('Jamaica Observer')).toBeInTheDocument();
	});

	it('should render the fallback source logo for an unknown news source', () => {
		// Given: the component renders with an article from an unknown source
		render(ArticleDetailView, { props: { article: unknownSourceArticle } });

		// When: the page loads

		// Then: should display the fallback logo with generic alt text
		expect(screen.getByAltText('Source')).toBeInTheDocument();
	});

	it('should not render published date when publishedDate is absent', () => {
		// Given: the component renders with an article with no publishedDate
		render(ArticleDetailView, { props: { article: { ...gleanerArticle, publishedDate: '' } } });

		// When: the page loads

		// Then: should not render a time element
		expect(screen.queryByRole('time')).not.toBeInTheDocument();
	});

	it('should render the Analysis heading', () => {
		// Given: the component renders with an article that has a classification
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display the Analysis heading
		expect(screen.getByRole('heading', { level: 2, name: 'Analysis' })).toBeInTheDocument();
	});

	it('should render the reasoning text in the Analysis section', () => {
		// Given: the component renders with an article that has classification reasoning
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display the reasoning text
		expect(screen.getByTestId('analysis-reasoning')).toHaveTextContent(
			gleanerArticle.classifications[0].reasoning!
		);
	});

	it('should not render the Analysis section when classifications is empty', () => {
		// Given: the component renders with an article with no classifications
		render(ArticleDetailView, { props: { article: { ...gleanerArticle, classifications: [] } } });

		// When: the page loads

		// Then: should not display the Analysis heading
		expect(screen.queryByRole('heading', { level: 2, name: 'Analysis' })).not.toBeInTheDocument();
	});

	it('should render related article cards when relatedArticles are provided', () => {
		// Given: two related articles with null snippets (as returned by the API)
		const related1: Article = {
			...gleanerArticle,
			id: 'rel-00000000-0000-0000-0000-000000000001',
			title: 'Related Article One',
			snippet: null
		};
		const related2: Article = {
			...observerArticle,
			id: 'rel-00000000-0000-0000-0000-000000000002',
			title: 'Related Article Two',
			snippet: null
		};
		render(ArticleDetailView, {
			props: { article: gleanerArticle, relatedArticles: [related1, related2] }
		});

		// When: the page loads

		// Then: should display both related article titles
		expect(screen.getByText('Related Article One')).toBeInTheDocument();
		expect(screen.getByText('Related Article Two')).toBeInTheDocument();
	});

	it('should show empty state when relatedArticles is an empty array', () => {
		// Given: the component renders with no related articles
		render(ArticleDetailView, { props: { article: gleanerArticle, relatedArticles: [] } });

		// When: the page loads

		// Then: should display the empty state message
		expect(screen.getByTestId('no-related-articles')).toHaveTextContent(
			'No related articles found.'
		);
	});

	it('should show empty state when relatedArticles prop is omitted', () => {
		// Given: the component renders without a relatedArticles prop
		render(ArticleDetailView, { props: { article: gleanerArticle } });

		// When: the page loads

		// Then: should display the empty state message
		expect(screen.getByTestId('no-related-articles')).toBeInTheDocument();
	});
});
