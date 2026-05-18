import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ArticleSourceHeader from './ArticleSourceHeader.svelte';
import type { Article } from '$lib/api/types';

const gleanerArticle: Article = {
	id: 'test-gleaner-1',
	url: 'https://jamaica-gleaner.com/article/test',
	title: 'Test Article',
	section: 'news',
	newsSource: 'JAMAICA_GLEANER',
	publishedDate: '2025-11-18T09:15:00Z',
	snippet: 'Test snippet.',
	entities: ['Entity One'],
	classifications: [{ classifierType: 'CORRUPTION', confidenceScore: 0.92 }]
};

const observerArticle: Article = {
	...gleanerArticle,
	newsSource: 'JAMAICA_OBSERVER',
	classifications: [{ classifierType: 'FRAUD', confidenceScore: 0.78 }]
};

const unknownSourceArticle: Article = {
	...gleanerArticle,
	newsSource: 'OTHER_SOURCE'
};

describe('ArticleSourceHeader', () => {
	it('should render the Jamaica Gleaner logo and source name', () => {
		// Given: an article from Jamaica Gleaner
		render(ArticleSourceHeader, { props: { article: gleanerArticle } });

		// When: the component renders

		// Then: should display the Gleaner logo and source name
		expect(screen.getByAltText('Jamaica Gleaner')).toBeInTheDocument();
		expect(screen.getByText('Jamaica Gleaner')).toBeInTheDocument();
	});

	it('should render the Jamaica Observer logo and source name', () => {
		// Given: an article from Jamaica Observer
		render(ArticleSourceHeader, { props: { article: observerArticle } });

		// When: the component renders

		// Then: should display the Observer logo and source name
		expect(screen.getByAltText('Jamaica Observer')).toBeInTheDocument();
		expect(screen.getByText('Jamaica Observer')).toBeInTheDocument();
	});

	it('should render the fallback logo for an unknown news source', () => {
		// Given: an article from an unknown source
		render(ArticleSourceHeader, { props: { article: unknownSourceArticle } });

		// When: the component renders

		// Then: should display the fallback logo with generic alt text and label
		expect(screen.getByAltText('Source')).toBeInTheDocument();
		expect(screen.getByText('Source')).toBeInTheDocument();
	});

	it('should render the published date when present', () => {
		// Given: an article with a published date
		render(ArticleSourceHeader, { props: { article: gleanerArticle } });

		// When: the component renders

		// Then: should display the formatted date
		expect(screen.getByRole('time')).toBeInTheDocument();
		expect(screen.getByRole('time')).toHaveTextContent('Nov 18, 2025');
	});

	it('should not render the published date when absent', () => {
		// Given: an article with no published date
		render(ArticleSourceHeader, { props: { article: { ...gleanerArticle, publishedDate: '' } } });

		// When: the component renders

		// Then: should not render a time element
		expect(screen.queryByRole('time')).not.toBeInTheDocument();
	});

	it('should render the classification badge when present', () => {
		// Given: an article with a classification
		render(ArticleSourceHeader, { props: { article: gleanerArticle } });

		// When: the component renders

		// Then: should display the badge in lowercase
		expect(screen.getByText('corruption')).toBeInTheDocument();
	});

	it('should render the confidence pill with the correct score', () => {
		// Given: an article with a classification confidence score
		render(ArticleSourceHeader, { props: { article: gleanerArticle } });

		// When: the component renders

		// Then: should display Certainty and the rounded percentage
		expect(screen.getByText('Certainty')).toBeInTheDocument();
		expect(screen.getByText('92%')).toBeInTheDocument();
	});

	it('should not render the badge or confidence pill when classifications is empty', () => {
		// Given: an article with no classifications
		render(ArticleSourceHeader, { props: { article: { ...gleanerArticle, classifications: [] } } });

		// When: the component renders

		// Then: should not display a badge or confidence pill
		expect(screen.queryByText('corruption')).not.toBeInTheDocument();
		expect(screen.queryByText('Certainty')).not.toBeInTheDocument();
	});
});
