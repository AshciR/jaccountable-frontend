import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AnalysisAlert from './AnalysisAlert.svelte';

describe('AnalysisAlert', () => {
	it('should render the reasoning text', () => {
		// Given: the component renders with a reasoning string
		render(AnalysisAlert, { props: { reasoning: 'Article covers fraud allegations.' } });

		// When: the component mounts

		// Then: should display the reasoning text
		expect(screen.getByTestId('analysis-reasoning')).toHaveTextContent(
			'Article covers fraud allegations.'
		);
	});
});
