import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Hero from './Hero.svelte';

describe('Hero', () => {
	it('renders the main headline', () => {
		render(Hero);
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
			'Every Scandal. Every Investigation. One Place.'
		);
	});

	it('renders gradient text spans with gradient-text class', () => {
		render(Hero);
		const gradientSpans = screen.getAllByText(/Scandal|Investigation|Place/);

		expect(gradientSpans).toHaveLength(3);
		gradientSpans.forEach((span) => {
			expect(span).toHaveClass('gradient-text');
		});
	});

	it('renders each headline line with staggered animation classes', () => {
		render(Hero);
		const heading = screen.getByRole('heading', { level: 1 });
		const lineSpans = heading.querySelectorAll(':scope > span.block');

		expect(lineSpans).toHaveLength(3);
		expect(lineSpans[0]).toHaveClass('animate-line-1');
		expect(lineSpans[1]).toHaveClass('animate-line-2');
		expect(lineSpans[2]).toHaveClass('animate-line-3');
	});
});
