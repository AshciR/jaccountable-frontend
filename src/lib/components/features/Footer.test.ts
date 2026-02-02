import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Footer from './Footer.svelte';

describe('Footer', () => {
	it('should display the logo', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display the logo
		const logo = screen.getByAltText('JAccountable Logo');
		expect(logo).toBeInTheDocument();
		expect(logo).toHaveClass('h-8');
	});

	it('should display the brand name', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display the brand name
		const brandName = screen.getByTestId('brand-name');
		expect(brandName).toBeInTheDocument();
		expect(brandName.textContent).toBe('JACCOUNTABLE');
	});

	it('should display PRIVACY link with correct href', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display PRIVACY link
		const privacyLink = screen.getByRole('link', { name: /privacy/i });
		expect(privacyLink).toBeInTheDocument();
		expect(privacyLink).toHaveAttribute('href', '/privacy');
	});

	it('should display TERMS link with correct href', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display TERMS link
		const termsLink = screen.getByRole('link', { name: /terms/i });
		expect(termsLink).toBeInTheDocument();
		expect(termsLink).toHaveAttribute('href', '/terms');
	});

	it('should display CONTACT link', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display CONTACT link
		const contactButton = screen.getByRole('button', { name: /contact/i });
		expect(contactButton).toBeInTheDocument();
		expect(contactButton).toHaveClass('uppercase');
	});

	it('should open Google Form when CONTACT is clicked', () => {
		// Given: the footer renders
		const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
		render(Footer);

		// When: user clicks CONTACT
		const contactButton = screen.getByRole('button', { name: /contact/i });
		fireEvent.click(contactButton);

		// Then: should open Google Form in new tab
		expect(windowOpenSpy).toHaveBeenCalledWith(
			'https://forms.gle/nVwg2J3pQVBiPwuJ7',
			'_blank',
			'noopener,noreferrer'
		);
		windowOpenSpy.mockRestore();
	});

	it('should display copyright notice', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display copyright
		expect(screen.getByText(/© 2026 JACCOUNTABLE/i)).toBeInTheDocument();
	});

	it('should display Spritewrench credit', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display credit link
		const creditLink = screen.getByRole('link', { name: /spritewrench\.com/i });
		expect(creditLink).toBeInTheDocument();
		expect(creditLink).toHaveAttribute('href', 'https://spritewrench.com/');
		expect(creditLink).toHaveAttribute('target', '_blank');
		expect(creditLink).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('should display slogan', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display slogan
		expect(screen.getByText(/JAccountable.*Monitoring Governance/i)).toBeInTheDocument();
	});
});
