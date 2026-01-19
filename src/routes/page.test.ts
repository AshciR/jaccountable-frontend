import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Page from './+page.svelte';

describe('+page.svelte', () => {
	it('renders the main heading', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Accountable');
	});

	it('renders the design system preview text', () => {
		render(Page);
		expect(screen.getByText('Design System Preview')).toBeInTheDocument();
	});

	it('renders the semantic colors section', () => {
		render(Page);
		expect(screen.getByRole('heading', { name: 'Semantic Colors' })).toBeInTheDocument();
	});

	it('renders the primary button', () => {
		render(Page);
		expect(screen.getByRole('button', { name: 'Primary Button' })).toBeInTheDocument();
	});
});
