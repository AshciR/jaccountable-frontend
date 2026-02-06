import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('posthog-js', () => ({
	default: {
		capture: vi.fn()
	}
}));

vi.mock('$app/environment', () => ({
	browser: true
}));

import posthog from 'posthog-js';
import { trackEvent, isInternalUser } from './analytics';

describe('analytics', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('isInternalUser', () => {
		it('should return true when hostname includes localhost', () => {
			// Given: the hostname is localhost

			// When: checking if the user is internal
			const result = isInternalUser();

			// Then: should return true
			expect(result).toBe(true);
		});
	});

	describe('trackEvent', () => {
		it('should capture event with common properties', () => {
			// Given: a browser environment

			// When: tracking an event
			trackEvent('share:whatsapp_button_click');

			// Then: should call posthog.capture with environment and is_internal
			expect(posthog.capture).toHaveBeenCalledWith('share:whatsapp_button_click', {
				environment: 'test',
				is_internal: true
			});
		});

		it('should merge custom properties with common properties', () => {
			// Given: custom properties to include

			// When: tracking an event with additional properties
			trackEvent('search:query_submit', {
				search_query: 'petrojam',
				results_count: 5
			});

			// Then: should include both common and custom properties
			expect(posthog.capture).toHaveBeenCalledWith('search:query_submit', {
				environment: 'test',
				is_internal: true,
				search_query: 'petrojam',
				results_count: 5
			});
		});

		it('should not capture events when not in browser', async () => {
			// Given: a server environment
			vi.resetModules();
			vi.doMock('$app/environment', () => ({
				browser: false
			}));
			vi.doMock('posthog-js', () => ({
				default: { capture: vi.fn() }
			}));

			const { trackEvent: serverTrackEvent } = await import('./analytics');
			const posthogModule = await import('posthog-js');

			// When: attempting to track an event
			serverTrackEvent('share:whatsapp_button_click');

			// Then: should not call posthog.capture
			expect(posthogModule.default.capture).not.toHaveBeenCalled();
		});
	});
});
