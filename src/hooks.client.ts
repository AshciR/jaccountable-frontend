import * as Sentry from '@sentry/sveltekit';
import posthog from 'posthog-js';
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';
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
	if (isDev) {
		const { worker } = await import('$lib/mocks/browser');
		await worker.start({ onUnhandledRequest: 'bypass' });
		console.log('Mock APIs initialized');
	}
}

function initializePostHog() {
	posthog.init(PUBLIC_POSTHOG_KEY, {
		api_host: 'https://us.i.posthog.com',
		capture_pageview: false
	});
	console.log('Analytics initialized');
}

function initializeSentry(environment: string) {
	// If you don't want to use Session Replay, remove the `Replay` integration,
	// `replaysSessionSampleRate` and `replaysOnErrorSampleRate` options.
	Sentry.init({
		dsn: 'https://1e60c3df69dcb5c0146d459661e68ec7@o4510846661754880.ingest.us.sentry.io/4510846664769536',
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
