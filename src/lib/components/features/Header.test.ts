import { render, screen, fireEvent } from '@testing-library/svelte';
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

	it('should display the SEARCH navigation link with correct href', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should display the SEARCH navigation link with correct href
		const navLink = screen.getByRole('link', { name: 'SEARCH' });
		expect(navLink).toBeInTheDocument();
		expect(navLink).toHaveAttribute('href', '/#search');
	});

	it('should display the WHY navigation link with correct href', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should display the WHY navigation link with correct href
		const navLink = screen.getByRole('link', { name: 'WHY' });
		expect(navLink).toBeInTheDocument();
		expect(navLink).toHaveAttribute('href', '/#why');
	});

	it('should display the HOW IT WORKS navigation link with correct href', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should display the HOW IT WORKS navigation link with correct href
		const navLink = screen.getByRole('link', { name: 'HOW IT WORKS' });
		expect(navLink).toBeInTheDocument();
		expect(navLink).toHaveAttribute('href', '/#how-it-works');
	});

	it('should display the FAQ navigation link with correct href', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should display the FAQ navigation link with correct href
		const navLink = screen.getByRole('link', { name: 'FAQ' });
		expect(navLink).toBeInTheDocument();
		expect(navLink).toHaveAttribute('href', '/#faq');
	});

	it('should display the SHARE navigation link with correct href', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should display the SHARE navigation link with correct href
		const navLink = screen.getByRole('link', { name: 'SHARE' });
		expect(navLink).toBeInTheDocument();
		expect(navLink).toHaveAttribute('href', '/#share');
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
		const navLink = screen.getAllByRole('link', { name: 'WHY' })[0];
		expect(navLink).toHaveClass('uppercase');
	});

	it('should render a hamburger menu button intended for mobile', () => {
		// Given: the header component renders
		render(Header);

		// When: the page loads

		// Then: should render the hamburger button with mobile-only visibility class
		const button = screen.getByRole('button', { name: 'Open menu' });
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('md:hidden');
	});

	it('should show mobile nav links when hamburger button is clicked', async () => {
		// Given: the header component renders
		render(Header);

		// When: user clicks the hamburger button
		const button = screen.getByRole('button', { name: 'Open menu' });
		await fireEvent.click(button);

		// Then: should show the close button and duplicate nav links from mobile menu
		expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
		expect(screen.getAllByRole('link', { name: 'WHY' })).toHaveLength(2);
	});

	it('should hide mobile menu when hamburger button is clicked again', async () => {
		// Given: the header renders with menu open
		render(Header);
		const button = screen.getByRole('button', { name: 'Open menu' });
		await fireEvent.click(button);

		// When: user clicks the close button
		await fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));

		// Then: should only have desktop nav links remaining
		expect(screen.getAllByRole('link', { name: 'WHY' })).toHaveLength(1);
	});
});
