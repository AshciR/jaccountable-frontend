import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SearchSection from './SearchSection.svelte';

describe('SearchSection', () => {
	it('should render the section with correct id', () => {
		// Given: the search section component renders
		render(SearchSection);

		// When: the page loads

		// Then: should render the section with correct id
		const section = document.querySelector('section#search');
		expect(section).toBeInTheDocument();
	});

	it('should contain the search bar with placeholder', () => {
		// Given: the search section component renders
		render(SearchSection);

		// When: the page loads

		// Then: should contain the search bar with placeholder
		const input = screen.getByPlaceholderText('Search for articles. Ex. Petrojam');
		expect(input).toBeInTheDocument();
	});

	it('should display article cards when searching for CMU', async () => {
		// Given: the search section component renders
		render(SearchSection);
		const input = screen.getByPlaceholderText('Search for articles. Ex. Petrojam');

		// When: user searches for "CMU"
		await fireEvent.input(input, { target: { value: 'CMU' } });
		const form = input.closest('form')!;
		await fireEvent.submit(form);

		// Then: should display article cards with CMU-related content
		await waitFor(() => {
			expect(
				screen.getByText('Court Rejects Claims of Nullity in Reid CMU Fraud Case, Trial to Proceed')
			).toBeInTheDocument();
			expect(screen.getByText('CMU Fraud Investigation Continues')).toBeInTheDocument();
			expect(
				screen.getByText('CMU Board Meets to Discuss Institutional Reforms')
			).toBeInTheDocument();
		});

		// And: should display "more results" message since only 3 of 4 are shown
		expect(screen.getByText('1 more result available')).toBeInTheDocument();

		// And: should NOT display the 4th article (limited to 3)
		expect(screen.queryByText('CMU Students Demand Greater Transparency')).not.toBeInTheDocument();
	});

	it('should display entity badges for search results', async () => {
		// Given: the search section component renders
		render(SearchSection);
		const input = screen.getByPlaceholderText('Search for articles. Ex. Petrojam');

		// When: user searches for "CMU"
		await fireEvent.input(input, { target: { value: 'CMU' } });
		const form = input.closest('form')!;
		await fireEvent.submit(form);

		// Then: should display entity badges including CMU
		await waitFor(() => {
			const cmuBadges = screen.getAllByText('CMU');
			expect(cmuBadges.length).toBeGreaterThan(0);
		});
	});

	it('should display no results message when search returns empty', async () => {
		// Given: the search section component renders
		render(SearchSection);
		const input = screen.getByPlaceholderText('Search for articles. Ex. Petrojam');

		// When: user searches for something that doesn't exist
		await fireEvent.input(input, { target: { value: 'xyznonexistent' } });
		const form = input.closest('form')!;
		await fireEvent.submit(form);

		// Then: should display no results message
		await waitFor(() => {
			expect(screen.getByText('No results found')).toBeInTheDocument();
		});
	});

	it('should display the 3 most recent articles on load', async () => {
		// Given: the search section component renders
		render(SearchSection);

		// When: the component fetches latest articles on mount

		// Then: should display the latest stories label and the 3 most recent articles
		await waitFor(() => {
			expect(screen.getByText('Latest Stories')).toBeInTheDocument();
			expect(
				screen.getByText('Auditor General Flags Irregularities in Parish Council Spending')
			).toBeInTheDocument();
			expect(
				screen.getByText('Public Defender Calls for Police Oversight Reform')
			).toBeInTheDocument();
			expect(
				screen.getByText('Integrity Commission Investigates No-Bid Government Contracts')
			).toBeInTheDocument();
		});
	});

	it('should replace the label with the search query when user searches', async () => {
		// Given: the search section component renders with latest stories
		render(SearchSection);
		await waitFor(() => {
			expect(screen.getByText('Latest Stories')).toBeInTheDocument();
		});
		const input = screen.getByPlaceholderText('Search for articles. Ex. Petrojam');

		// When: user searches for "CMU"
		await fireEvent.input(input, { target: { value: 'CMU' } });
		const form = input.closest('form')!;
		await fireEvent.submit(form);

		// Then: should replace the latest stories label with the search query
		await waitFor(() => {
			expect(screen.getByTestId('search-section-search-query')).toHaveTextContent('CMU');
			expect(screen.queryByText('Latest Stories')).not.toBeInTheDocument();
		});
	});

	it('should show latest stories when user submits a blank search', async () => {
		// Given: the user has performed a search
		render(SearchSection);
		const input = screen.getByPlaceholderText('Search for articles. Ex. Petrojam');
		await fireEvent.input(input, { target: { value: 'CMU' } });
		const form = input.closest('form')!;
		await fireEvent.submit(form);
		await waitFor(() => {
			expect(screen.queryByText('Latest Stories')).not.toBeInTheDocument();
		});

		// When: user clears the input and submits a blank search
		await fireEvent.input(input, { target: { value: '' } });
		await fireEvent.submit(form);

		// Then: should return to showing the latest stories
		await waitFor(() => {
			expect(screen.getByText('Latest Stories')).toBeInTheDocument();
			expect(
				screen.getByText('Auditor General Flags Irregularities in Parish Council Spending')
			).toBeInTheDocument();
		});
	});
});
