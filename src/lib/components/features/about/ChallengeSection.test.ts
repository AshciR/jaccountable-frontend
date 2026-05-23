import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ChallengeSection from './ChallengeSection.svelte';

describe('ChallengeSection', () => {
	it('should display the section label', () => {
		// Given: the challenge section component renders
		render(ChallengeSection);

		// When: the page loads

		// Then: should display the section label
		expect(screen.getByText('The Challenge')).toBeInTheDocument();
	});

	it('should display the main heading', () => {
		// Given: the challenge section component renders
		render(ChallengeSection);

		// When: the page loads

		// Then: should display the main heading
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
			'Facts get lost when we rely on memory alone.'
		);
	});

	it('should display the body paragraph', () => {
		// Given: the challenge section component renders
		render(ChallengeSection);

		// When: the page loads

		// Then: should display the body paragraph
		const paragraph = screen.getByText(
			'Government accountability depends on maintaining an accurate record of events, statements, and actions over time. When important stories are scattered across articles and dates, it becomes nearly impossible to track developments, establish timelines, or see the bigger picture without dedicated archiving and organization.'
		);
		expect(paragraph).toBeInTheDocument();
	});
});
