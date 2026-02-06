import { trackEvent } from '$lib/utils/analytics';
import { openContactForm } from '$lib/utils/contact';

export function shareOnWhatsApp(shareMessage: string, shareUrl: string): void {
	trackEvent('share:whatsapp_button_click');
	const whatsappText = `${shareMessage} ${shareUrl}`;
	window.open(
		`https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
		'_blank',
		'noopener,noreferrer'
	);
}

export function shareOnTwitter(encodedMessage: string, encodedUrl: string): void {
	trackEvent('share:twitter_button_click');
	window.open(
		`https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
		'_blank',
		'noopener,noreferrer'
	);
}

export async function copyToClipboard(shareUrl: string): Promise<boolean> {
	trackEvent('share:copy_url_button_click');
	try {
		await navigator.clipboard.writeText(shareUrl);
		return true;
	} catch (err) {
		console.error('Failed to copy:', err);
		return false;
	}
}

export function handleFeedbackClick(): void {
	trackEvent('share:feedback_button_click');
	openContactForm();
}
