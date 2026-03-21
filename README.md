![CI](https://github.com/AshciR/jaccountable-frontend/actions/workflows/ci.yml/badge.svg)

# JAccountable Frontend

A web interface for Jamaica's government accountability news monitoring system.

## About

JAccountable is an intelligent news monitoring system that tracks government accountability issues in Jamaica. This frontend provides a user-friendly interface to browse and explore articles identified by the backend's AI-powered analysis.

### What JAccountable Does

The system monitors Jamaican news sources (starting with Jamaica Gleaner) and uses AI to identify articles related to government accountability, including:

- Corruption investigations and scandals
- Court cases involving public officials
- Government ministry and agency activities
- Political party news (JLP, PNP)
- Public fund management issues

Each article receives a relevance score (1-10) based on accountability-related keywords and context, helping users quickly identify the most pertinent stories.

## Tech Stack

- [Svelte](https://svelte.dev/) / [SvelteKit](https://kit.svelte.dev/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn-svelte](https://www.shadcn-svelte.com/) - UI component library
- [Lucide](https://lucide.dev/) - Icons
- [MSW](https://mswjs.io/) - API mocking for development

## Project Structure

```
src/lib/components/
├── ui/           # Atomic components (shadcn-svelte primitives)
│   └── input/    # e.g., Input, Button, Card
└── features/     # Non-atomic components (page-level, composed)
    ├── Hero.svelte
    ├── SearchBar.svelte
    └── SearchSection.svelte
```

- **Atomic components** (`ui/`): Small, reusable primitives managed by shadcn-svelte
- **Feature components** (`features/`): Page-level components that compose atomic components

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

```sh
yarn install
```

### Development

Start the development server with mock API data (default):

```sh
yarn dev
```

Start the development server pointed at a local backend (`http://localhost:8000`):

```sh
yarn dev:realapi
```

You can also toggle this per-session by setting `PUBLIC_USE_REAL_API=true` in `.env.development`. See `.env.example` for all available environment variables.

### Building for Production

```sh
yarn build
```

Preview the production build:

```sh
yarn preview
```

## Testing

This project uses [Vitest](https://vitest.dev/) with [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/) for component testing.

### Running Tests

```sh
yarn test        # Run tests once
yarn test:watch  # Run tests in watch mode
```

### BDD Testing Pattern

Tests follow the **Given/When/Then** BDD format using comments for clarity:

```typescript
describe('ComponentName', () => {
	it('should display the expected content', () => {
		// Given: the component renders
		render(Component);

		// When: the page loads

		// Then: should display the expected content
		expect(screen.getByRole('heading')).toBeInTheDocument();
	});
});
```

- **Given**: Describes the initial context/state
- **When**: Describes the action or event
- **Then**: Describes the expected outcome (test assertions)

## Analytics

This project uses [PostHog](https://posthog.com/) for event tracking via `$lib/utils/analytics.ts`.

### Utility Functions

- **`trackEvent(eventName, properties?)`** — wraps `posthog.capture()`, automatically attaches `environment` and `is_internal` to every event. Guarded with a `browser` check for SSR safety.
- **`getDistinctId()`** — returns PostHog's auto-generated anonymous `distinct_id` (browser-only, returns `undefined` server-side).
- **`isInternalUser()`** — returns `true` when running on localhost.

### Naming Conventions

Following [PostHog best practices](https://posthog.com/docs/product-analytics/best-practices):

- **Event names**: `category:object_action` pattern, lowercase snake_case (e.g., `share:whatsapp_button_click`)
- **Property names**: `object_adjective` pattern (e.g., `search_query`, `results_count`)
- **Boolean properties**: `is_` or `has_` prefix (e.g., `is_internal`, `has_results`)

### Frontend Events (tracked in this repo)

| Event                         | Location              |
| ----------------------------- | --------------------- |
| `share:whatsapp_button_click` | `share-section.ts`    |
| `share:twitter_button_click`  | `share-section.ts`    |
| `share:copy_url_button_click` | `share-section.ts`    |
| `share:bookmark_button_click` | `ShareSection.svelte` |
| `share:feedback_button_click` | `share-section.ts`    |

### Backend Events (tracked in the backend repo)

| Event                 | Reason moved to backend                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `search:query_submit` | Server-side action — backend is authoritative for result counts; backend tracking avoids silent data loss from ad blockers |

### User Identification (no login)

PostHog auto-generates an anonymous `distinct_id` stored in `localStorage` — no `identify` call is needed.

To link frontend and backend events to the same user, all API requests go through `apiFetch` (`$lib/api/fetch.ts`), a drop-in replacement for `fetch` that automatically injects:

- **`X-PostHog-Distinct-Id`** — PostHog's anonymous ID, so the backend can use the same `distinct_id` when capturing events
- **`X-Internal-Request: true`** — set when `isInternalUser()` is true, so the backend can flag internal traffic

This means all events (frontend + backend) are associated with the same anonymous user across sessions without requiring authentication.

### Test Setup for Analytics

When testing components or utilities that use analytics, add these mocks at the top of the test file:

```typescript
vi.mock('posthog-js', () => ({
	default: { capture: vi.fn(), get_distinct_id: vi.fn().mockReturnValue('test-id') }
}));

vi.mock('$app/environment', () => ({
	browser: true
}));
```

Ensure `window.location` mocks include `hostname` (not just `href`) to avoid `isInternalUser()` errors.
