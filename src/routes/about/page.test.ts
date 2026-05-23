import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('About page', () => {
	it('should display the About Us section label', () => {
		// Given: the about page renders
		render(Page);

		// When: the page loads

		// Then: should display the "About Us" accent label
		expect(screen.getByText('About Us')).toBeInTheDocument();
	});

	it('should display the page heading', () => {
		// Given: the about page renders
		render(Page);

		// When: the page loads

		// Then: should display the main heading
		const heading = screen.getByRole('heading', {
			level: 1,
			name: /independent record of Jamaican government accountability/i
		});
		expect(heading).toBeInTheDocument();
	});

	it('should render the Challenge (Why) section', () => {
		// Given: the about page renders
		render(Page);

		// When: the page loads

		// Then: should include the Challenge section's heading
		expect(
			screen.getByRole('heading', { name: /facts get lost when we rely on memory alone/i })
		).toBeInTheDocument();
	});

	it('should render the FAQ section', () => {
		// Given: the about page renders
		render(Page);

		// When: the page loads

		// Then: should include the FAQ heading
		expect(
			screen.getByRole('heading', { name: /frequently asked questions/i })
		).toBeInTheDocument();
	});
});
