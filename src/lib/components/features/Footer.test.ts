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

	it('should display ABOUT link with correct href', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display ABOUT link pointing to /about
		const aboutLink = screen.getByRole('link', { name: /about/i });
		expect(aboutLink).toBeInTheDocument();
		expect(aboutLink).toHaveAttribute('href', '/about');
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

	it('should display GIVE FEEDBACK button', () => {
		// Given: the footer renders
		render(Footer);

		// When: the page loads

		// Then: should display GIVE FEEDBACK button
		const feedbackButton = screen.getByRole('button', { name: /give feedback/i });
		expect(feedbackButton).toBeInTheDocument();
		expect(feedbackButton).toHaveClass('uppercase');
	});

	it('should open the UserJot widget when GIVE FEEDBACK is clicked', () => {
		// Given: the footer renders with window.uj mocked
		const showWidget = vi.fn();
		(window as unknown as { uj: { showWidget: typeof showWidget } }).uj = { showWidget };
		render(Footer);

		// When: user clicks GIVE FEEDBACK
		const feedbackButton = screen.getByRole('button', { name: /give feedback/i });
		fireEvent.click(feedbackButton);

		// Then: should open the feedback widget
		expect(showWidget).toHaveBeenCalledWith({ section: 'feedback' });
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
