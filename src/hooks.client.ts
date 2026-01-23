async function initMocks() {
	if (import.meta.env.DEV) {
		const { worker } = await import('$lib/mocks/browser');
		await worker.start({ onUnhandledRequest: 'bypass' });
	}
}

initMocks();
