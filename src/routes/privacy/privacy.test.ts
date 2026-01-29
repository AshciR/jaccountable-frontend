import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import PrivacyPage from './+page.svelte';

describe('Privacy Page', () => {
	it('should display the Legal label', () => {
		// Given: the privacy page renders
		render(PrivacyPage);

		// When: the page loads

		// Then: should display the Legal label
		expect(screen.getByText('Legal')).toBeInTheDocument();
	});

	it('should display the Privacy Policy heading', () => {
		// Given: the privacy page renders
		render(PrivacyPage);

		// When: the page loads

		// Then: should display the heading
		const headings = screen.getAllByRole('heading', { name: /privacy policy/i });
		expect(headings.length).toBeGreaterThanOrEqual(1);
		expect(headings[0]).toBeInTheDocument();
	});

	it('should render the privacy policy content', () => {
		// Given: the privacy page renders
		render(PrivacyPage);

		// When: the page loads

		// Then: should render the privacy content container
		const content = document.querySelector('.privacy-content');
		expect(content).toBeInTheDocument();
	});

	it('should render the footer', () => {
		// Given: the privacy page renders
		render(PrivacyPage);

		// When: the page loads

		// Then: should render the footer
		const footer = screen.getByRole('contentinfo');
		expect(footer).toBeInTheDocument();
	});
});
