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

describe('Layout', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
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
});
