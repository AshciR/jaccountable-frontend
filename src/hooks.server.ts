import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

const { PUBLIC_USE_REAL_API } = env;

const mockMode = dev && PUBLIC_USE_REAL_API !== 'true';

if (mockMode) {
	const { setupServer } = await import('msw/node');
	const { handlers } = await import('$lib/mocks/handlers');

	const devServer = setupServer(...handlers);
	devServer.listen({ onUnhandledRequest: 'bypass' });
	console.log('Mock APIs initialized [node server]');
}
