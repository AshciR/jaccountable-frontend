import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ChallengeSection from './ChallengeSection.svelte';

describe('ChallengeSection', () => {
	it('renders the section label', () => {
		render(ChallengeSection);
		expect(screen.getByText('The Challenge')).toBeInTheDocument();
	});

	it('renders the main heading', () => {
		render(ChallengeSection);
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
			'Facts get lost when we rely on memory alone.'
		);
	});

	it('renders the body paragraph', () => {
		render(ChallengeSection);
		const paragraph = screen.getByText(
			'Government accountability depends on maintaining an accurate record of events, statements, and actions over time. When important stories are scattered across articles and dates, it becomes nearly impossible to track developments, establish timelines, or see the bigger picture without dedicated archiving and organization.'
		);
		expect(paragraph).toBeInTheDocument();
	});
});
