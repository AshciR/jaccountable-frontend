import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/svelte';

// Mock posthog-js
vi.mock('posthog-js', () => ({
	default: {
		init: vi.fn(),
		capture: vi.fn()
	}
}));

// Mock $app/environment
vi.mock('$app/environment', () => ({
	browser: true
}));

// Mock $app/state
vi.mock('$app/state', () => ({
	page: {
		url: { pathname: '/test-path' },
		error: null
	}
}));

// Mock $env/static/public
vi.mock('$env/static/public', () => ({
	PUBLIC_POSTHOG_KEY: 'phc_test_key'
}));

import posthog from 'posthog-js';
import Layout from './+layout.svelte';

describe('Layout - PostHog Analytics', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should initialize PostHog with correct config', async () => {
		// Given: the layout loads in a browser environment
		const { load } = await import('./+layout');

		// When: the load function runs
		await load();

		// Then: should initialize PostHog with the API key and host
		expect(posthog.init).toHaveBeenCalledWith('phc_test_key', {
			api_host: 'https://us.i.posthog.com',
			capture_pageview: false
		});
	});

	it('should capture pageview on render', () => {
		// Given: the layout component renders with a children snippet

		// When: the component mounts
		render(Layout, {
			props: {
				children: () => {}
			}
		});

		// Then: should capture a pageview event with the current path
		expect(posthog.capture).toHaveBeenCalledWith('$pageview', {
			path: '/test-path'
		});
	});

	it('should not initialize PostHog when not in browser', async () => {
		// Given: we're in a server environment
		vi.resetModules();
		vi.doMock('$app/environment', () => ({
			browser: false
		}));
		vi.doMock('$env/static/public', () => ({
			PUBLIC_POSTHOG_KEY: 'phc_test_key'
		}));
		vi.doMock('posthog-js', () => ({
			default: {
				init: vi.fn(),
				capture: vi.fn()
			}
		}));

		const { load } = await import('./+layout');
		const posthogModule = await import('posthog-js');

		// When: the load function runs
		await load();

		// Then: should not call posthog.init
		expect(posthogModule.default.init).not.toHaveBeenCalled();
	});
});
