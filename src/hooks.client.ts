import posthog from 'posthog-js';
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';
import type { ClientInit } from '@sveltejs/kit';

export const init: ClientInit = async () => {
	await initMocks();
	initializePostHog();
};

async function initMocks() {
	if (import.meta.env.DEV) {
		const { worker } = await import('$lib/mocks/browser');
		await worker.start({ onUnhandledRequest: 'bypass' });
	}
}

function initializePostHog() {
	posthog.init(PUBLIC_POSTHOG_KEY, {
		api_host: 'https://us.i.posthog.com',
		capture_pageview: false
	});
}
