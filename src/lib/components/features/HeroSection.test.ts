import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import HeroSection from './HeroSection.svelte';

describe('HeroSection', () => {
	it('should display the main headline', () => {
		// Given: the hero component renders
		render(HeroSection);

		// When: the page loads

		// Then: should display the main headline
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
			'Every Scandal. Every Investigation. One Place.'
		);
	});

	it('should display gradient text spans with gradient-text class', () => {
		// Given: the hero component renders
		render(HeroSection);

		// When: the page loads

		// Then: should display gradient text spans with gradient-text class
		const gradientSpans = screen.getAllByText(/Scandal|Investigation|Place/);

		expect(gradientSpans).toHaveLength(3);
		gradientSpans.forEach((span) => {
			expect(span).toHaveClass('gradient-text');
		});
	});

	it('should display each headline line with staggered animation classes', () => {
		// Given: the hero component renders
		render(HeroSection);

		// When: the page loads

		// Then: should display each headline line with staggered animation classes
		const heading = screen.getByRole('heading', { level: 1 });
		const lineSpans = heading.querySelectorAll(':scope > span.block');

		expect(lineSpans).toHaveLength(3);
		expect(lineSpans[0]).toHaveClass('animate-line-1');
		expect(lineSpans[1]).toHaveClass('animate-line-2');
		expect(lineSpans[2]).toHaveClass('animate-line-3');
	});
});
