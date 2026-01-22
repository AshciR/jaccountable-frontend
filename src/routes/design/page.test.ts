import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Page from './+page.svelte';

describe('Design System Preview Page', () => {
	it('should display the main heading', () => {
		// Given: the design system page renders
		render(Page);

		// When: the page loads

		// Then: should display the main heading
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Accountable');
	});

	it('should display the design system preview text', () => {
		// Given: the design system page renders
		render(Page);

		// When: the page loads

		// Then: should display the design system preview text
		expect(screen.getByText('Design System Preview')).toBeInTheDocument();
	});

	it('should display the semantic colors section', () => {
		// Given: the design system page renders
		render(Page);

		// When: the page loads

		// Then: should display the semantic colors section
		expect(screen.getByRole('heading', { name: 'Semantic Colors' })).toBeInTheDocument();
	});

	it('should display the primary button', () => {
		// Given: the design system page renders
		render(Page);

		// When: the page loads

		// Then: should display the primary button
		expect(screen.getByRole('button', { name: 'Primary Button' })).toBeInTheDocument();
	});
});
