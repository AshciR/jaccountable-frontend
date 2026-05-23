import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FAQSection from './FAQSection.svelte';

describe('FAQSection', () => {
	it('should display the section label', () => {
		// Given: the FAQ section component renders
		render(FAQSection);

		// When: the page loads

		// Then: should display the section label
		expect(screen.getByText('FAQ')).toBeInTheDocument();
	});

	it('should display the main heading', () => {
		// Given: the FAQ section component renders
		render(FAQSection);

		// When: the page loads

		// Then: should display the main heading
		expect(
			screen.getByRole('heading', { level: 2, name: /frequently asked questions/i })
		).toBeInTheDocument();
	});

	it('should render all 7 FAQ questions', () => {
		// Given: the FAQ section component renders
		render(FAQSection);

		// When: the page loads

		// Then: should render all 7 FAQ questions
		expect(screen.getByText('What is JAccountable?')).toBeInTheDocument();
		expect(screen.getByText('Where does the information come from?')).toBeInTheDocument();
		expect(screen.getByText(/Is this platform affiliated/)).toBeInTheDocument();
		expect(screen.getByText(/What does "AI-powered" mean/)).toBeInTheDocument();
		expect(screen.getByText('Is JAccountable free to use?')).toBeInTheDocument();
		expect(screen.getByText(/Do you collect my data/)).toBeInTheDocument();
		expect(screen.getByText(/Why should I trust this/)).toBeInTheDocument();
	});

	it('should expand accordion item when clicked', async () => {
		// Given: the FAQ section component renders
		render(FAQSection);

		// When: user clicks on the first FAQ question
		const firstQuestion = screen.getByText('What is JAccountable?');
		await fireEvent.click(firstQuestion);

		// Then: should expand and show the answer
		expect(screen.getByText(/helps Jamaicans keep track/)).toBeVisible();
	});

	it('should collapse accordion item when clicked twice', async () => {
		// Given: the FAQ section component renders and first item is expanded
		render(FAQSection);
		const firstQuestion = screen.getByText('What is JAccountable?');
		await fireEvent.click(firstQuestion);

		// When: user clicks the same question again
		await fireEvent.click(firstQuestion);

		// Then: should collapse the answer
		expect(screen.queryByText(/helps Jamaicans keep track/)).not.toBeVisible();
	});

	it('should close previous item when opening a new item', async () => {
		// Given: the FAQ section component renders with first item open
		render(FAQSection);
		const firstQuestion = screen.getByText('What is JAccountable?');
		await fireEvent.click(firstQuestion);

		// When: user clicks on a different question
		const secondQuestion = screen.getByText('Where does the information come from?');
		await fireEvent.click(secondQuestion);

		// Then: first item should be collapsed and second item should be expanded
		expect(screen.queryByText(/helps Jamaicans keep track/)).not.toBeVisible();
		expect(screen.getByText(/All content is sourced from established/)).toBeVisible();
	});
});
