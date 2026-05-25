import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('posthog-js', () => ({
	default: {
		capture: vi.fn()
	}
}));

vi.mock('$app/environment', () => ({
	browser: true
}));

import posthog from 'posthog-js';
import ArticleCard from './ArticleCard.svelte';
import type { Article } from '$lib/api/types';

const gleanerArticle: Article = {
	id: 'test-gleaner-1',
	url: 'https://jamaica-gleaner.com/article/test',
	title: 'Test Gleaner Article Title',
	section: 'news',
	newsSource: 'JAMAICA_GLEANER',
	publishedDate: '2025-01-15T10:30:00Z',
	snippet: 'This is a <mark>test</mark> snippet with highlighted text.',
	entities: ['Entity One', 'Entity Two', 'Entity Three'],
	classifications: [{ classifierType: 'CORRUPTION', confidenceScore: 0.92 }]
};

const observerArticle: Article = {
	id: 'test-observer-1',
	url: 'https://jamaica-observer.com/article/test',
	title: 'Test Observer Article Title',
	section: 'politics',
	newsSource: 'JAMAICA_OBSERVER',
	publishedDate: '2025-01-14T08:00:00Z',
	snippet: 'Observer article snippet without highlights.',
	entities: ['Person A', 'Organization B'],
	classifications: [{ classifierType: 'FRAUD', confidenceScore: 0.78 }]
};

const unknownSourceArticle: Article = {
	id: 'test-unknown-1',
	url: 'https://other-news.com/article/test',
	title: 'Test Unknown Source Article',
	section: 'news',
	newsSource: 'OTHER_SOURCE',
	publishedDate: '2025-01-13T12:00:00Z',
	snippet: 'Article from an unknown source.',
	entities: ['Entity X'],
	classifications: [{ classifierType: 'MISCONDUCT', confidenceScore: 0.85 }]
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

	// Certainty score
	if (article.classifications.length > 0) {
		const certaintyDisplay = `${Math.round(article.classifications[0].confidenceScore * 100)}%`;
		expect(screen.getByText(certaintyDisplay)).toBeInTheDocument();
		expect(screen.getByText('Certainty')).toBeInTheDocument();
	}

	// Preview section label displayed
	expect(screen.getByText('Preview')).toBeInTheDocument();

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
		article.newsSource === 'JAMAICA_GLEANER'
			? 'Jamaica Gleaner'
			: article.newsSource === 'JAMAICA_OBSERVER'
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

	it('should call onTopicClick with entity name when an entity pill is clicked', async () => {
		// Given: an article with entities and an onTopicClick callback
		const onTopicClick = vi.fn();
		render(ArticleCard, { props: { article: gleanerArticle, onTopicClick } });

		// When: user clicks an entity pill
		await fireEvent.click(screen.getByRole('button', { name: 'Entity One' }));

		// Then: should call onTopicClick with the entity name
		expect(onTopicClick).toHaveBeenCalledWith('Entity One');
		expect(onTopicClick).toHaveBeenCalledTimes(1);
	});

	it('should not throw when entity pill is clicked without onTopicClick prop', async () => {
		// Given: an article rendered without an onTopicClick callback
		render(ArticleCard, { props: { article: gleanerArticle } });

		// When: user clicks an entity pill
		// Then: should not throw
		await expect(
			fireEvent.click(screen.getByRole('button', { name: 'Entity One' }))
		).resolves.not.toThrow();
	});

	it('should show leading and trailing ellipsis for a mid-article excerpt', () => {
		// Given: an article with fullText where the snippet is in the middle
		const fullText =
			'Sentence one. Sentence two. Sentence three. Sentence four. Sentence five. Sentence six. Sentence seven. Sentence eight.';
		const articleWithFullText: Article = {
			...gleanerArticle,
			snippet: 'Sentence five.',
			fullText
		};
		render(ArticleCard, { props: { article: articleWithFullText } });

		// When: the component renders with the snippet matching sentence 5 (index 4 of 8)
		// The window will be sentences 3–7 (adjustedStart=2, endIndex=7)
		const paragraphs = screen.getAllByTestId('excerpt-sentence');

		// Then: should show leading "..." on the first excerpt paragraph
		expect(paragraphs[0].textContent).toMatch(/^\.\.\./);

		// And: should show trailing "..." on the last excerpt paragraph
		expect(paragraphs[paragraphs.length - 1].textContent).toMatch(/\.\.\.$/);
	});

	it('should not show leading ellipsis when excerpt starts at the beginning of the article', () => {
		// Given: an article where the snippet matches the first sentence
		const fullText =
			'Sentence one. Sentence two. Sentence three. Sentence four. Sentence five. Sentence six. Sentence seven. Sentence eight.';
		const articleWithFullText: Article = {
			...gleanerArticle,
			snippet: 'Sentence one.',
			fullText
		};
		render(ArticleCard, { props: { article: articleWithFullText } });

		// When: the component renders with snippet at the start (adjustedStart=0)
		const paragraphs = screen.getAllByTestId('excerpt-sentence');

		// Then: should not show leading "..."
		expect(paragraphs[0].textContent).not.toMatch(/^\.\.\./);

		// And: should still show trailing "..." since there are more sentences after
		expect(paragraphs[paragraphs.length - 1].textContent).toMatch(/\.\.\.$/);
	});

	it('should not show trailing ellipsis when excerpt ends at the last sentence', () => {
		// Given: an article where the snippet matches the last sentence
		const fullText =
			'Sentence one. Sentence two. Sentence three. Sentence four. Sentence five. Sentence six. Sentence seven. Sentence eight.';
		const articleWithFullText: Article = {
			...gleanerArticle,
			snippet: 'Sentence eight.',
			fullText
		};
		render(ArticleCard, { props: { article: articleWithFullText } });

		// When: the component renders with snippet at the end (endIndex === sentences.length)
		const paragraphs = screen.getAllByTestId('excerpt-sentence');

		// Then: should show leading "..." since excerpt doesn't start at beginning
		expect(paragraphs[0].textContent).toMatch(/^\.\.\./);

		// And: should not show trailing "..."
		expect(paragraphs[paragraphs.length - 1].textContent).not.toMatch(/\.\.\.$/);
	});

	it('should always show trailing ellipsis when there is no fullText', () => {
		// Given: an article without fullText (snippet-only fallback)
		const articleWithoutFullText: Article = {
			...gleanerArticle,
			snippet: 'Just a raw snippet with no full text.',
			fullText: undefined
		};
		render(ArticleCard, { props: { article: articleWithoutFullText } });

		// When: the component renders using the fallback path
		const paragraphs = screen.getAllByTestId('excerpt-sentence');

		// Then: should not show leading "..."
		expect(paragraphs[0].textContent).not.toMatch(/^\.\.\./);

		// And: should show trailing "..."
		expect(paragraphs[0].textContent).toMatch(/\.\.\.$/);
	});

	describe('share button', () => {
		let writeTextMock: ReturnType<typeof vi.fn>;
		let shareMock: ReturnType<typeof vi.fn> | undefined;

		beforeEach(() => {
			vi.clearAllMocks();

			Object.defineProperty(window, 'location', {
				value: {
					href: 'https://example.com/',
					origin: 'https://example.com',
					hostname: 'example.com'
				},
				writable: true,
				configurable: true
			});

			writeTextMock = vi.fn().mockResolvedValue(undefined);
			Object.defineProperty(navigator, 'clipboard', {
				value: { writeText: writeTextMock },
				writable: true,
				configurable: true
			});
		});

		afterEach(() => {
			if (shareMock) {
				// @ts-expect-error — remove the optional navigator.share mock between tests
				delete navigator.share;
				shareMock = undefined;
			}
			vi.restoreAllMocks();
		});

		it('should call navigator.share with the in-app article URL when native share is available', async () => {
			// Given: navigator.share is available
			shareMock = vi.fn().mockResolvedValue(undefined);
			Object.defineProperty(navigator, 'share', {
				value: shareMock,
				writable: true,
				configurable: true
			});
			render(ArticleCard, { props: { article: gleanerArticle } });

			// When: user clicks the share button
			await fireEvent.click(screen.getByTestId('article-share-button'));

			// Then: should invoke navigator.share with the /articles/{id} URL
			await waitFor(() => {
				expect(shareMock).toHaveBeenCalledWith({
					title: gleanerArticle.title,
					text: gleanerArticle.title,
					url: `https://example.com/articles/${gleanerArticle.id}`
				});
			});

			// And: should track the native share event
			expect(posthog.capture).toHaveBeenCalledWith(
				'share:article_native_share',
				expect.objectContaining({ article_id: gleanerArticle.id })
			);
		});

		it('should fall back to clipboard when navigator.share is unavailable', async () => {
			// Given: navigator.share is not defined
			render(ArticleCard, { props: { article: gleanerArticle } });

			// When: user clicks the share button
			await fireEvent.click(screen.getByTestId('article-share-button'));

			// Then: should write the /articles/{id} URL to the clipboard
			await waitFor(() => {
				expect(writeTextMock).toHaveBeenCalledWith(
					`https://example.com/articles/${gleanerArticle.id}`
				);
			});

			// And: should track the copy event
			expect(posthog.capture).toHaveBeenCalledWith(
				'share:article_copy_url',
				expect.objectContaining({ article_id: gleanerArticle.id })
			);
		});

		it('should swap the share icon for a check after a successful clipboard copy', async () => {
			// Given: navigator.share is unavailable so we hit the clipboard fallback
			const { container } = render(ArticleCard, { props: { article: gleanerArticle } });

			// When: user clicks the share button
			await fireEvent.click(screen.getByTestId('article-share-button'));

			// Then: should render the check icon inside the share button
			await waitFor(() => {
				const button = screen.getByTestId('article-share-button');
				expect(button.querySelector('.lucide-check')).not.toBeNull();
			});
			expect(container).toBeTruthy();
		});
	});

	it('should handle empty classifications array', () => {
		// Given: an article with no classifications
		const articleWithNoClassifications: Article = {
			...gleanerArticle,
			classifications: []
		};
		render(ArticleCard, { props: { article: articleWithNoClassifications } });

		// When: the component renders

		// Then: should not display certainty or category badge
		expect(screen.queryByText('Certainty')).not.toBeInTheDocument();
		expect(screen.queryByText('corruption')).not.toBeInTheDocument();

		// And: should still display other content
		expect(screen.getByText(articleWithNoClassifications.title)).toBeInTheDocument();
	});
});
