import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FeaturesSection from './FeaturesSection.svelte';

describe('FeaturesSection', () => {
	it('should display the section heading', () => {
		// Given: the features section component renders
		render(FeaturesSection);

		// When: the page loads

		// Then: should display the section heading
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('From Noise to Clarity');
	});

	it('should display the subtext', () => {
		// Given: the features section component renders
		render(FeaturesSection);

		// When: the page loads

		// Then: should display the subtext
		expect(
			screen.getByText(
				'Our proprietary AI engine ingests thousands of documents to connect the dots you might miss.'
			)
		).toBeInTheDocument();
	});

	it('should display all three feature titles', () => {
		// Given: the features section component renders
		render(FeaturesSection);

		// When: the page loads

		// Then: should display all three feature titles
		expect(screen.getByRole('heading', { name: 'Data Ingestion' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'AI Classification' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: 'Public Access' })).toBeInTheDocument();
	});

	it('should display all three feature descriptions', () => {
		// Given: the features section component renders
		render(FeaturesSection);

		// When: the page loads

		// Then: should display all three feature descriptions
		expect(
			screen.getByText(
				'Documents from government sources, news archives, and official records are continuously collected and indexed.'
			)
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'Our AI classification engine identifies articles about corruption, and link related stories across decades.'
			)
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'The data is made searchable for journalists, researchers, and concerned citizens.'
			)
		).toBeInTheDocument();
	});
});
