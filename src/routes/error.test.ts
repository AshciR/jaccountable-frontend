import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import ErrorPage from './+error.svelte';

describe('ErrorPage', () => {
	it('should display the 404 heading', () => {
		// Given: the error page renders
		render(ErrorPage);

		// When: the page loads

		// Then: should display the 404 heading
		const heading = screen.getByRole('heading', { name: /hush yaw, cyaan find it/i });
		expect(heading).toBeInTheDocument();
	});

	it('should display the error description', () => {
		// Given: the error page renders
		render(ErrorPage);

		// When: the page loads

		// Then: should display the error description
		const description = screen.getByText(
			/the story you're looking for might have moved or doesn't exist/i
		);
		expect(description).toBeInTheDocument();
	});

	it('should have a link to return home with brand green styling', () => {
		// Given: the error page renders
		render(ErrorPage);

		// When: the page loads

		// Then: should have a link to return home
		const link = screen.getByRole('link', { name: /return to home/i });
		expect(link).toHaveAttribute('href', '/');
		expect(link).toHaveClass('bg-accent');
	});

	it('should display the logo', () => {
		// Given: the error page renders
		render(ErrorPage);

		// When: the page loads

		// Then: should display the logo
		const logo = screen.getByAltText('JAccountable Logo');
		expect(logo).toBeInTheDocument();
	});

	it('should display the 404 badge', () => {
		// Given: the error page renders
		render(ErrorPage);

		// When: the page loads

		// Then: should display the 404 badge
		const badge = screen.getByText('404');
		expect(badge).toBeInTheDocument();
	});

	it('should display the footer text', () => {
		// Given: the error page renders
		render(ErrorPage);

		// When: the page loads

		// Then: should display the footer text
		const footer = screen.getByText(/jaccountable.*monitoring governance/i);
		expect(footer).toBeInTheDocument();
	});
});
