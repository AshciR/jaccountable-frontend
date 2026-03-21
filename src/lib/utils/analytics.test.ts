import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('posthog-js', () => ({
	default: {
		capture: vi.fn(),
		get_distinct_id: vi.fn().mockReturnValue('test-distinct-id')
	}
}));

vi.mock('$app/environment', () => ({
	browser: true
}));

import posthog from 'posthog-js';
import { trackEvent, isInternalUser, getDistinctId } from './analytics';

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
			trackEvent('share:copy_url_button_click', {
				url: 'https://jaccountable.com'
			});

			// Then: should include both common and custom properties
			expect(posthog.capture).toHaveBeenCalledWith('share:copy_url_button_click', {
				environment: 'test',
				is_internal: true,
				url: 'https://jaccountable.com'
			});
		});

		describe('getDistinctId', () => {
			it('should return the PostHog distinct ID in browser context', () => {
				// Given: a browser environment with an active PostHog session

				// When: getting the distinct ID
				const result = getDistinctId();

				// Then: should return the PostHog-generated ID
				expect(result).toBe('test-distinct-id');
			});

			it('should return undefined when not in browser', async () => {
				// Given: a server environment
				vi.resetModules();
				vi.doMock('$app/environment', () => ({ browser: false }));
				vi.doMock('posthog-js', () => ({
					default: { capture: vi.fn(), get_distinct_id: vi.fn() }
				}));

				const { getDistinctId: serverGetDistinctId } = await import('./analytics');

				// When: getting the distinct ID on the server
				const result = serverGetDistinctId();

				// Then: should return undefined
				expect(result).toBeUndefined();
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
