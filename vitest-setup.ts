import '@testing-library/jest-dom/vitest';
import { server } from '$lib/mocks/server';
import { beforeAll, afterEach, afterAll } from 'vitest';

// jsdom does not support the Web Animations API used by Svelte 5 transitions
Element.prototype.animate = function () {
	let onfinishCallback: (() => void) | null = null;
	const animation = {
		cancel: () => {},
		finish: () => {},
		pause: () => {},
		play: () => {},
		reverse: () => {},
		finished: Promise.resolve(),
		currentTime: 0,
		playState: 'finished',
		get onfinish() {
			return onfinishCallback;
		},
		set onfinish(cb: (() => void) | null) {
			onfinishCallback = cb;
			if (cb) queueMicrotask(cb);
		}
	};
	return animation as unknown as Animation;
};

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
