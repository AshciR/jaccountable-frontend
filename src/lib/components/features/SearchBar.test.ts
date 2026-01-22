import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import SearchBar from './SearchBar.svelte';

describe('SearchBar', () => {
	it('should display the search input with default placeholder', () => {
		// Given: the search bar component renders
		render(SearchBar);

		// When: the page loads

		// Then: should display the search input with default placeholder
		const input = screen.getByPlaceholderText('Petrojam');
		expect(input).toBeInTheDocument();
	});

	it('should display the search input with custom placeholder', () => {
		// Given: the search bar component renders with custom placeholder
		render(SearchBar, { props: { placeholder: 'Search reports...' } });

		// When: the page loads

		// Then: should display the search input with custom placeholder
		const input = screen.getByPlaceholderText('Search reports...');
		expect(input).toBeInTheDocument();
	});

	it('should display the search icon', () => {
		// Given: the search bar component renders
		render(SearchBar);

		// When: the page loads

		// Then: should display the search icon
		const icon = document.querySelector('svg');
		expect(icon).toBeInTheDocument();
	});

	it('should update input value when user types', async () => {
		// Given: the search bar component renders
		render(SearchBar);
		const input = screen.getByPlaceholderText('Petrojam') as HTMLInputElement;

		// When: user types in the search input
		await fireEvent.input(input, { target: { value: 'test query' } });

		// Then: should update the input value
		expect(input.value).toBe('test query');
	});

	it('should call onSearch callback when form is submitted', async () => {
		// Given: the search bar component renders with onSearch callback
		const onSearch = vi.fn();
		render(SearchBar, { props: { onSearch } });
		const input = screen.getByPlaceholderText('Petrojam');

		// When: user types and submits the form
		await fireEvent.input(input, { target: { value: 'test query' } });
		const form = input.closest('form')!;
		await fireEvent.submit(form);

		// Then: should call onSearch with the query
		expect(onSearch).toHaveBeenCalledWith('test query');
	});

	it('should not call onSearch callback when query is empty', async () => {
		// Given: the search bar component renders with onSearch callback
		const onSearch = vi.fn();
		render(SearchBar, { props: { onSearch } });
		const input = screen.getByPlaceholderText('Petrojam');

		// When: user submits the form without entering a query
		const form = input.closest('form')!;
		await fireEvent.submit(form);

		// Then: should not call onSearch
		expect(onSearch).not.toHaveBeenCalled();
	});

	it('should have glow effect element', () => {
		// Given: the search bar component renders
		render(SearchBar);

		// When: the page loads

		// Then: should have glow effect element with the correct class
		const glowElement = document.querySelector('.glow-effect');
		expect(glowElement).toBeInTheDocument();
		expect(glowElement).toHaveClass('glow-effect');
	});
});
