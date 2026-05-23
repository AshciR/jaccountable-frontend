import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import SearchSection from './SearchSection.svelte';
import { mockArticles } from '$lib/mocks/fixtures/articles';

describe('SearchSection', () => {
	const defaultProps = {
		displayedArticles: [],
		hasMoreResults: false,
		remainingCount: 0,
		sectionLabel: 'Latest Stories',
		noResults: false,
		isLoading: false,
		isLoadingMore: false,
		topics: [],
		selectedTopic: null as string | null,
		topicSort: 'most_found' as const,
		total: 0,
		hasSearched: false,
		onSearch: vi.fn(),
		onTopicClick: vi.fn(),
		onSortChange: vi.fn(),
		onLoadMore: vi.fn()
	};

	it('should render the section with correct id', () => {
		// Given: the search section component renders
		render(SearchSection, { props: defaultProps });

		// When: the page loads

		// Then: should render the section with correct id
		const section = document.querySelector('section#search');
		expect(section).toBeInTheDocument();
	});

	it('should contain the search bar with placeholder', () => {
		// Given: the search section component renders
		render(SearchSection, { props: defaultProps });

		// When: the page loads

		// Then: should contain the search bar with placeholder
		const input = screen.getByPlaceholderText('Search articles — try a name, place, or topic…');
		expect(input).toBeInTheDocument();
	});

	it('should display the loading spinner when isLoading is true', () => {
		// Given: the component is in a loading state
		render(SearchSection, { props: { ...defaultProps, isLoading: true } });

		// When: the page loads

		// Then: should display the loading spinner
		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	it('should display the section label', () => {
		// Given: the component receives a section label
		render(SearchSection, { props: { ...defaultProps, sectionLabel: 'Latest Stories' } });

		// When: the page loads

		// Then: should display the section label
		expect(screen.getByTestId('search-section-search-query')).toHaveTextContent('Latest Stories');
	});

	it('should display article cards when articles are provided', () => {
		// Given: the component receives articles to display
		const articles = mockArticles.slice(0, 3);
		render(SearchSection, {
			props: { ...defaultProps, displayedArticles: articles, sectionLabel: 'CMU' }
		});

		// When: the page loads

		// Then: should display the article titles
		expect(
			screen.getByText('Court Rejects Claims of Nullity in Reid CMU Fraud Case, Trial to Proceed')
		).toBeInTheDocument();
		expect(screen.getByText('CMU Fraud Investigation Continues')).toBeInTheDocument();
		expect(
			screen.getByText('CMU Board Meets to Discuss Institutional Reforms')
		).toBeInTheDocument();
	});

	it('should display the Load More button when hasMoreResults is true', () => {
		// Given: there are more results than displayed
		render(SearchSection, {
			props: {
				...defaultProps,
				displayedArticles: mockArticles.slice(0, 5),
				hasMoreResults: true,
				remainingCount: 7,
				sectionLabel: 'CMU'
			}
		});

		// When: the page loads

		// Then: should show the Load More button with remaining count
		expect(screen.getByRole('button', { name: /load more \(7 remaining\)/i })).toBeInTheDocument();
	});

	it('should call onLoadMore when the Load More button is clicked', async () => {
		// Given: the Load More button is visible
		const onLoadMore = vi.fn();
		render(SearchSection, {
			props: {
				...defaultProps,
				displayedArticles: mockArticles.slice(0, 5),
				hasMoreResults: true,
				remainingCount: 7,
				sectionLabel: 'CMU',
				onLoadMore
			}
		});

		// When: user clicks Load More
		await fireEvent.click(screen.getByRole('button', { name: /load more/i }));

		// Then: should call onLoadMore
		expect(onLoadMore).toHaveBeenCalledOnce();
	});

	it('should show loading state in the Load More button when isLoadingMore is true', () => {
		// Given: a Load More operation is in progress
		render(SearchSection, {
			props: {
				...defaultProps,
				displayedArticles: mockArticles.slice(0, 5),
				hasMoreResults: true,
				remainingCount: 7,
				sectionLabel: 'CMU',
				isLoadingMore: true
			}
		});

		// When: the page loads

		// Then: the Load More button should be disabled and show loading text
		const button = screen.getByRole('button', { name: /loading/i });
		expect(button).toBeDisabled();
	});

	it('should display no results message when noResults is true', () => {
		// Given: the search returned no results
		render(SearchSection, {
			props: { ...defaultProps, noResults: true, sectionLabel: 'xyznonexistent' }
		});

		// When: the page loads

		// Then: should display no results message
		expect(screen.getByText('No results found')).toBeInTheDocument();
	});

	it('should display entity badges for articles', () => {
		// Given: the component receives articles with entities
		const articles = mockArticles.slice(0, 3);
		render(SearchSection, {
			props: { ...defaultProps, displayedArticles: articles, sectionLabel: 'CMU' }
		});

		// When: the page loads

		// Then: should display entity badges including CMU
		const cmuBadges = screen.getAllByText('CMU');
		expect(cmuBadges.length).toBeGreaterThan(0);
	});

	it('should call onTopicClick when an entity pill in an article card is clicked', async () => {
		// Given: articles are displayed and onTopicClick is provided
		const onTopicClick = vi.fn();
		const articles = mockArticles.slice(0, 1);
		render(SearchSection, {
			props: { ...defaultProps, displayedArticles: articles, onTopicClick }
		});

		// When: user clicks an entity pill
		await fireEvent.click(screen.getByRole('button', { name: 'Fritz Pinnock' }));

		// Then: should call onTopicClick with the entity name
		expect(onTopicClick).toHaveBeenCalledWith('Fritz Pinnock');
	});

	it('should display the results count after a search', () => {
		// Given: a search has been performed with results
		render(SearchSection, {
			props: {
				...defaultProps,
				hasSearched: true,
				total: 42,
				displayedArticles: mockArticles.slice(0, 3),
				sectionLabel: 'CMU'
			}
		});

		// When: the page loads

		// Then: should display the results count
		expect(screen.getByText('42 articles found')).toBeInTheDocument();
	});

	it('should not display the results count when noResults is true', () => {
		// Given: a search returned no results
		render(SearchSection, {
			props: {
				...defaultProps,
				hasSearched: true,
				total: 0,
				noResults: true,
				sectionLabel: 'xyznonexistent'
			}
		});

		// When: the page loads

		// Then: should not display a results count
		expect(screen.queryByText(/articles found/)).not.toBeInTheDocument();
	});

	it('should call onSearch when the search form is submitted', async () => {
		// Given: the component renders with an onSearch callback
		const onSearch = vi.fn();
		render(SearchSection, { props: { ...defaultProps, onSearch } });
		const input = screen.getByPlaceholderText('Search articles — try a name, place, or topic…');

		// When: user types a query and submits the form
		await fireEvent.input(input, { target: { value: 'CMU' } });
		const form = input.closest('form')!;
		await fireEvent.submit(form);

		// Then: should call onSearch with the query
		expect(onSearch).toHaveBeenCalledWith('CMU');
	});
});
