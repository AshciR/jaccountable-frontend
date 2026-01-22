import { render, screen } from '@testing-library/svelte';
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
});
