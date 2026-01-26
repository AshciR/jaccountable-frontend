import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import ShareSection from './ShareSection.svelte';

describe('ShareSection', () => {
	let windowOpenSpy: ReturnType<typeof vi.spyOn>;
	let writeTextMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		// Mock window.open
		windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

		// Mock window.location.href
		Object.defineProperty(window, 'location', {
			value: { href: 'https://example.com' },
			writable: true,
			configurable: true
		});

		// Mock navigator.clipboard
		writeTextMock = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: writeTextMock
			},
			writable: true,
			configurable: true
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	// Content rendering tests
	it('should display the section label', () => {
		// Given: the share section component renders
		render(ShareSection);

		// When: the page loads

		// Then: should display the section label
		expect(screen.getByText('SPREAD THE WORD')).toBeInTheDocument();
	});

	it('should display the main heading', () => {
		// Given: the share section component renders
		render(ShareSection);

		// When: the page loads

		// Then: should display the main heading
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Find this useful?');
	});

	it('should display the subheading', () => {
		// Given: the share section component renders
		render(ShareSection);

		// When: the page loads

		// Then: should display the subheading
		expect(screen.getByText("Share it with someone who'd want to know.")).toBeInTheDocument();
	});

	it('should display all four share options', () => {
		// Given: the share section component renders
		render(ShareSection);

		// When: the page loads

		// Then: should display all four share buttons
		expect(screen.getByLabelText('Share on WhatsApp')).toBeInTheDocument();
		expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument();
		expect(screen.getByLabelText('Bookmark this page')).toBeInTheDocument();
		expect(screen.getByLabelText('Copy URL to clipboard')).toBeInTheDocument();
	});

	// WhatsApp share functionality
	it('should open WhatsApp share with custom message when WhatsApp button is clicked', () => {
		// Given: the share section component renders with window.open mocked
		render(ShareSection);

		// When: user clicks the WhatsApp button
		const whatsappButton = screen.getByLabelText('Share on WhatsApp');
		fireEvent.click(whatsappButton);

		// Then: should open WhatsApp share URL with message and URL
		const expectedMessage = encodeURIComponent(
			'Want to keep track of government accountability in Jamaica? Check out JAccountable. https://example.com'
		);
		expect(windowOpenSpy).toHaveBeenCalledWith(
			`https://wa.me/?text=${expectedMessage}`,
			'_blank',
			'noopener,noreferrer'
		);
	});

	// Twitter share functionality
	it('should open Twitter share with custom message when Twitter button is clicked', () => {
		// Given: the share section component renders with window.open mocked
		render(ShareSection);

		// When: user clicks the Twitter button
		const twitterButton = screen.getByLabelText('Share on Twitter');
		fireEvent.click(twitterButton);

		// Then: should open Twitter share URL with message and URL
		const expectedMessage = encodeURIComponent(
			'Want to keep track of government accountability in Jamaica? Check out JAccountable.'
		);
		const expectedUrl = encodeURIComponent('https://example.com');
		expect(windowOpenSpy).toHaveBeenCalledWith(
			`https://twitter.com/intent/tweet?text=${expectedMessage}&url=${expectedUrl}`,
			'_blank',
			'noopener,noreferrer'
		);
	});

	// Bookmark functionality
	it('should toggle bookmark tooltip when bookmark button is clicked', () => {
		// Given: the share section component renders
		render(ShareSection);

		// When: user clicks the bookmark button
		const bookmarkButton = screen.getByLabelText('Bookmark this page');
		fireEvent.click(bookmarkButton);

		// Then: should display the keyboard shortcut tooltip
		expect(screen.getByText(/Press (Cmd|Ctrl)\+D/)).toBeInTheDocument();
	});

	it('should hide bookmark tooltip when clicked again', async () => {
		// Given: the share section component renders with tooltip visible
		render(ShareSection);
		const bookmarkButton = screen.getByLabelText('Bookmark this page');
		fireEvent.click(bookmarkButton);

		// When: user clicks the bookmark button again
		fireEvent.click(bookmarkButton);

		// Then: should hide the keyboard shortcut tooltip
		await waitFor(() => {
			expect(screen.queryByText(/Press (Cmd|Ctrl)\+D/)).not.toBeInTheDocument();
		});
	});

	// Copy functionality
	it('should copy URL to clipboard when share button is clicked', async () => {
		// Given: the share section component renders with clipboard API mocked
		render(ShareSection);

		// When: user clicks the share button
		const shareButton = screen.getByLabelText('Copy URL to clipboard');
		fireEvent.click(shareButton);

		// Then: should copy URL to clipboard
		await waitFor(() => {
			expect(writeTextMock).toHaveBeenCalledWith('https://example.com');
		});
	});

	it('should show "URL Copied!" confirmation after copying URL', async () => {
		// Given: the share section component renders with clipboard API mocked
		render(ShareSection);

		// When: user clicks the share button
		const shareButton = screen.getByLabelText('Copy URL to clipboard');
		fireEvent.click(shareButton);

		// Then: should show "URL Copied!" confirmation
		await waitFor(() => {
			expect(screen.getByText('URL Copied!')).toBeInTheDocument();
		});
	});

	it('should reset copy confirmation after timeout', async () => {
		// Given: the share section component renders with copied state active
		vi.useFakeTimers();
		render(ShareSection);
		const shareButton = screen.getByLabelText('Copy URL to clipboard');
		fireEvent.click(shareButton);

		// When: 2 seconds pass
		await waitFor(() => {
			expect(screen.getByText('URL Copied!')).toBeInTheDocument();
		});
		vi.advanceTimersByTime(2000);

		// Then: should reset to "Share"
		await waitFor(() => {
			expect(screen.getByText('Share')).toBeInTheDocument();
		});

		vi.useRealTimers();
	});

	it('should handle clipboard API failure gracefully', async () => {
		// Given: the share section component renders with failing clipboard API
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const failingWriteTextMock = vi.fn().mockRejectedValue(new Error('Clipboard access denied'));
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: failingWriteTextMock
			},
			writable: true,
			configurable: true
		});
		render(ShareSection);

		// When: user clicks the share button
		const shareButton = screen.getByLabelText('Copy URL to clipboard');
		fireEvent.click(shareButton);

		// Then: should log error and not show copied state
		await waitFor(() => {
			expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
			expect(screen.queryByText('URL Copied!')).not.toBeInTheDocument();
		});

		consoleErrorSpy.mockRestore();
	});
});
