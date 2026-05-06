import * as Sentry from '@sentry/sveltekit';
import posthog from 'posthog-js';
import {
	PUBLIC_POSTHOG_API_HOST,
	PUBLIC_POSTHOG_KEY,
	PUBLIC_SENTRY_DSN,
	PUBLIC_USE_REAL_API
} from '$env/static/public';
import type { ClientInit } from '@sveltejs/kit';

export const init: ClientInit = async () => {
	const environment = getEnvironment().toLowerCase();
	console.log('Environment:', environment);

	await initMocks(environment);
	initializePostHog();
	initializeSentry(environment);
};

async function initMocks(environment: string) {
	const isDev = environment === 'development';
	const useRealApi = PUBLIC_USE_REAL_API === 'true';
	if (isDev && !useRealApi) {
		const { worker } = await import('$lib/mocks/browser');
		await worker.start({ onUnhandledRequest: 'bypass' });
		console.log('Mock APIs initialized [service worker]');
	}
}

function initializePostHog() {
	posthog.init(PUBLIC_POSTHOG_KEY, {
		api_host: PUBLIC_POSTHOG_API_HOST,
		ui_host: 'https://us.posthog.com',
		capture_pageview: false
	});
	console.log('Analytics initialized');
}

function initializeSentry(environment: string) {
	// If you don't want to use Session Replay, remove the `Replay` integration,
	// `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options.
	Sentry.init({
		dsn: PUBLIC_SENTRY_DSN,
		tracesSampleRate: 1,
		sendDefaultPii: true,
		environment: environment
	});
	console.log('Telemetry initialized');
}

function getEnvironment(): string {
	const environment: string = import.meta.env.MODE;
	return environment;
}

export const handleError = Sentry.handleErrorWithSentry();
