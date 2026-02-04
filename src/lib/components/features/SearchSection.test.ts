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
		onSearch: vi.fn()
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
		const input = screen.getByPlaceholderText('Search for articles. Ex. Petrojam');
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

	it('should display "more results" message when hasMoreResults is true', () => {
		// Given: there are more results than displayed
		render(SearchSection, {
			props: {
				...defaultProps,
				displayedArticles: mockArticles.slice(0, 3),
				hasMoreResults: true,
				remainingCount: 1,
				sectionLabel: 'CMU'
			}
		});

		// When: the page loads

		// Then: should show the remaining count
		expect(screen.getByText('1 more result available')).toBeInTheDocument();
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

	it('should call onSearch when the search form is submitted', async () => {
		// Given: the component renders with an onSearch callback
		const onSearch = vi.fn();
		render(SearchSection, { props: { ...defaultProps, onSearch } });
		const input = screen.getByPlaceholderText('Search for articles. Ex. Petrojam');

		// When: user types a query and submits the form
		await fireEvent.input(input, { target: { value: 'CMU' } });
		const form = input.closest('form')!;
		await fireEvent.submit(form);

		// Then: should call onSearch with the query
		expect(onSearch).toHaveBeenCalledWith('CMU');
	});
});
