import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TermsPage from './+page.svelte';

describe('Terms Page', () => {
	it('should display the Legal label', () => {
		// Given: the terms page renders
		render(TermsPage);

		// When: the page loads

		// Then: should display the Legal label
		expect(screen.getByText('Legal')).toBeInTheDocument();
	});

	it('should display the Terms of Service heading', () => {
		// Given: the terms page renders
		render(TermsPage);

		// When: the page loads

		// Then: should display the heading
		const headings = screen.getAllByRole('heading', { name: /terms of service/i });
		expect(headings.length).toBeGreaterThanOrEqual(1);
		expect(headings[0]).toBeInTheDocument();
	});

	it('should render the terms of service content', () => {
		// Given: the terms page renders
		render(TermsPage);

		// When: the page loads

		// Then: should render the terms content container
		const content = document.querySelector('.terms-content');
		expect(content).toBeInTheDocument();
	});

	it('should render the footer', () => {
		// Given: the terms page renders
		render(TermsPage);

		// When: the page loads

		// Then: should render the footer
		const footer = screen.getByRole('contentinfo');
		expect(footer).toBeInTheDocument();
	});
});
