import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import Header from './Header.svelte';

describe('Header', () => {
	it('renders the logo image', () => {
		render(Header);
		const logo = screen.getByAltText('JAccountable Logo');
		expect(logo).toBeInTheDocument();
	});

	it('renders the brand name text', () => {
		render(Header);
		const brandName = screen.getByText((content, element) => {
			return element?.textContent === 'JACCOUNTABLE';
		});
		expect(brandName).toBeInTheDocument();
	});

	it('renders the WHY navigation link', () => {
		render(Header);
		const navLink = screen.getByRole('link', { name: 'WHY' });
		expect(navLink).toBeInTheDocument();
		expect(navLink).toHaveAttribute('href', '#why');
	});

	it('has fixed positioning for sticky behavior', () => {
		render(Header);
		const header = screen.getByRole('banner');
		expect(header).toHaveClass('fixed');
	});

	it('navigation links are uppercase', () => {
		render(Header);
		const navLink = screen.getByRole('link', { name: 'WHY' });
		expect(navLink).toHaveClass('uppercase');
	});
});
