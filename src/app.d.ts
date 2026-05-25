// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface UserJotSDK {
		init: (projectId: string, options?: Record<string, unknown>) => void;
		showWidget: (options?: { section?: 'feedback' | 'roadmap' | 'updates' }) => void;
		hideWidget: () => void;
		identify: (options: Record<string, unknown> | null) => void;
	}

	interface Window {
		uj: UserJotSDK;
		$ujq: unknown[];
	}
}

export {};
