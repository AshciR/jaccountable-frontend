import posthog from 'posthog-js';
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	initializePostHog();
	return;
};

function initializePostHog() {
	if (browser) {
		posthog.init(PUBLIC_POSTHOG_KEY, {
			api_host: 'https://us.i.posthog.com',
			capture_pageview: false
		});
	}
}
