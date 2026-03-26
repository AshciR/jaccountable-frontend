import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		server: {
			proxy: {
				'/api': {
					target: 'http://localhost:8000',
					changeOrigin: true
				}
			}
		},
		plugins: [
			sentrySvelteKit({
				org: 'jaccountable',
				project: 'jaccountable-frontend',
				telemetry: false,
				authToken: env.SENTRY_AUTH_TOKEN
			}),
			tailwindcss(),
			sveltekit(),
			svelteTesting()
		],
		test: {
			environment: 'jsdom',
			setupFiles: ['./vitest-setup.ts'],
			include: ['src/**/*.{test,spec}.{js,ts}']
		}
	};
});
