import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Header from './Header.svelte';

describe('Header', () => {
	it('should display the logo image', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should display the logo image
		const logo = screen.getByAltText('JAccountable Logo');
		expect(logo).toBeInTheDocument();
	});

	it('should display the brand name text', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should display the brand name text
		const brandName = screen.getByText((content, element) => {
			return element?.textContent === 'JACCOUNTABLE';
		});
		expect(brandName).toBeInTheDocument();
	});

	it('should display the WHY navigation link with correct href', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should display the WHY navigation link with correct href
		const navLink = screen.getByRole('link', { name: 'WHY' });
		expect(navLink).toBeInTheDocument();
		expect(navLink).toHaveAttribute('href', '#why');
	});

	it('should have fixed positioning for sticky behavior', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should have fixed positioning
		const header = screen.getByRole('banner');
		expect(header).toHaveClass('fixed');
	});

	it('should display navigation links in uppercase', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should display navigation links in uppercase
		const navLink = screen.getByRole('link', { name: 'WHY' });
		expect(navLink).toHaveClass('uppercase');
	});
});
