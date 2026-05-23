import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import HeroSection from './HeroSection.svelte';

describe('HeroSection', () => {
	it('should display the main headline', () => {
		// Given: the hero component renders with no metrics
		render(HeroSection, { props: { metrics: null } });

		// When: the page loads

		// Then: should display the main headline
		expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
			'Every Scandal. Every Investigation. One Place.'
		);
	});

	it('should display gradient text spans with gradient-text class', () => {
		// Given: the hero component renders
		render(HeroSection, { props: { metrics: null } });

		// When: the page loads

		// Then: should display gradient text spans with gradient-text class
		const gradientSpans = screen.getAllByText(/Scandal|Investigation|Place/);

		expect(gradientSpans).toHaveLength(3);
		gradientSpans.forEach((span) => {
			expect(span).toHaveClass('gradient-text');
		});
	});

	it('should display the description', () => {
		// Given: the hero component renders
		render(HeroSection, { props: { metrics: null } });

		// When: the page loads

		// Then: should display the description copy with key words bolded
		expect(screen.getByText(/Track how Jamaican news outlets cover/i)).toBeInTheDocument();
		['scandals', 'investigations', 'people'].forEach((word) => {
			const node = screen.getByText(word);
			expect(node.tagName).toBe('STRONG');
		});
	});

	it('should display formatted metric counts and labels when metrics are provided', async () => {
		// Given: the hero component renders with metrics
		render(HeroSection, {
			props: { metrics: { articleCount: 12345, entityCount: 1200 } }
		});

		// When: the page loads and the count-up animation finishes

		// Then: should eventually show both stats with thousands separators and labels
		const articles = screen.getByTestId('metric-articles');
		const topics = screen.getByTestId('metric-topics');
		expect(articles).toHaveTextContent('Articles');
		expect(topics).toHaveTextContent('Topics');
		await waitFor(
			() => {
				expect(articles).toHaveTextContent('12,345');
				expect(topics).toHaveTextContent('1,200');
			},
			{ timeout: 3000 }
		);
	});

	it('should not render the stats block when metrics are null', () => {
		// Given: the hero component renders with no metrics
		render(HeroSection, { props: { metrics: null } });

		// When: the page loads

		// Then: should not render either metric block
		expect(screen.queryByTestId('metric-articles')).not.toBeInTheDocument();
		expect(screen.queryByTestId('metric-topics')).not.toBeInTheDocument();
	});
});
