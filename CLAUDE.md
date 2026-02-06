# jaccountable-frontend

An accountability app frontend built with SvelteKit.

## Tech Stack

- **Framework**: SvelteKit 2 with Svelte 5
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite 7
- **Linting**: ESLint 9 + Prettier
- **Adapter**: adapter-auto (auto-detects deployment platform)

## Commands

```bash
yarn dev        # Start dev server
yarn build      # Production build
yarn preview    # Preview production build
yarn check      # Type check
yarn lint       # Lint and format check
yarn format     # Format code with Prettier
```

## Project Structure

```
src/
  lib/           # Shared components, utilities, stores
    assets/      # Static assets (favicon, images)
    components/
      ui/        # Atomic components (small, reusable primitives from shadcn-svelte)
      features/  # Non-atomic components (page-level, composed components)
    utils/       # Utility functions (e.g., cn() for class merging)
    index.ts     # $lib exports
  routes/        # SvelteKit file-based routing
    +layout.svelte
    +page.svelte
  app.html       # HTML template
  app.d.ts       # App-level type declarations
static/          # Public static files
```

## Component Organization

### Atomic Components (`src/lib/components/ui/`)

Small, reusable UI primitives managed by shadcn-svelte. These are the building blocks:

- Input, Button, Card, Badge, etc.
- Added via `npx shadcn-svelte@latest add <component>`
- Do not modify directly; customize via props and CSS variables

### Non-Atomic Components (`src/lib/components/features/`)

Page-level, composed components that combine atomic components:

- Hero, SearchSection, SearchBar, ChallengeSection, etc.
- Colocate tests with components (e.g., `SearchBar.svelte` → `SearchBar.test.ts`)

## Conventions

- Use `$lib` alias for imports from `src/lib`
- Svelte 5 runes syntax (`$state`, `$derived`, `$effect`, etc.)
- **Always use keyed `#each` blocks** - when iterating over arrays, provide a unique key: `{#each items as item (item.id)}` to help Svelte track items efficiently and avoid bugs
- File-based routing with `+page.svelte`, `+layout.svelte`, `+server.ts` conventions
- **Always create tests when creating components** - colocate test files with components using `.test.ts` suffix
- **Test files must NOT use the `+` prefix** - files prefixed with `+` are reserved by SvelteKit (e.g., use `error.test.ts` not `+error.test.ts`)
- **Atomic components** go in `src/lib/components/ui/` (managed by shadcn-svelte)
- **Feature components** go in `src/lib/components/features/` (page-level, composed)

## State Management

- **Page components (`+page.svelte`) own application/data state** — data fetched from APIs, search results, loading flags, and derived display values live in the page and are passed to feature components as props
- **Feature components are presentational** — they receive data via `$props()` and render it. They do not fetch data or manage application state.
- **Local UI state stays in components** — state that only affects a single component's appearance (scroll position, tooltip visibility, form input bindings, clipboard feedback) remains in that component
- **Use `onMount` for one-time side effects** (e.g., initial data fetch). Use `$effect` for reactive side effects that should re-run when dependencies change.
- **Group related state into a single `$state` object** rather than separate variables (e.g., `let searchState = $state({ results: [], isLoading: true, ... })`) and mutate properties directly

## Analytics (PostHog)

Custom event tracking uses PostHog via `$lib/utils/analytics.ts`.

### Tracking Utility

- **`trackEvent(eventName, properties?)`** — wraps `posthog.capture()`, automatically attaches `environment` (from `import.meta.env.MODE`) and `is_internal` (from `isInternalUser()`) to every event. Guarded with `browser` check for SSR safety.
- **`isInternalUser()`** — dedicated function for internal user detection, currently checks `window.location.hostname.includes('localhost')`. Extracted for future extensibility (e.g., email-based checks).

### Event Naming Conventions

Following [PostHog best practices](https://posthog.com/docs/product-analytics/best-practices):

- **Event names**: `category:object_action` pattern, lowercase snake_case (e.g., `share:whatsapp_button_click`, `search:query_submit`)
- **Property names**: `object_adjective` pattern (e.g., `search_query`, `results_count`)
- **Boolean properties**: `is_` or `has_` prefix (e.g., `is_internal`, `has_results`)

### Companion `.ts` Files

When a component's handler logic becomes complex (e.g., combining share actions with tracking), extract the functions into a companion `.ts` file colocated with the component:

- `ShareSection.svelte` → `share-section.ts` (handlers with `trackEvent` calls)
- Each exported function includes its own `trackEvent` call
- The `.svelte` component stays focused on template and local UI state
- Component integration tests (e.g., `ShareSection.test.ts`) cover both UI behavior and tracking assertions — no separate unit tests needed for the companion `.ts` file

### Test Setup for Analytics

When testing components that use analytics, add these mocks at the top of the test file:

```typescript
vi.mock('posthog-js', () => ({
	default: { capture: vi.fn() }
}));

vi.mock('$app/environment', () => ({
	browser: true
}));
```

Ensure `window.location` mocks include `hostname` (not just `href`) to avoid `isInternalUser()` errors.

## Testing Conventions (BDD)

Tests use **BDD-style Given/When/Then comments** with Vitest and @testing-library/svelte.

### Development Workflow

**IMPORTANT: Visual check before writing tests**

When creating new components, follow this order:

1. Create the component file (e.g., `ComponentName.svelte`)
2. Add it to the appropriate page or parent component
3. Run `yarn dev` and visually verify the component looks correct
4. Only after visual confirmation, create the test file (e.g., `ComponentName.test.ts`)

This workflow ensures components are functional and properly integrated before writing tests, saving time by catching layout and styling issues early.

### Structure

```typescript
describe('ComponentName', () => {
	it('should display the heading', () => {
		// Given: the component renders
		render(Component);

		// When: the page loads

		// Then: should display the heading
		expect(screen.getByRole('heading')).toBeInTheDocument();
	});

	it('should trigger the action when button is clicked', () => {
		// Given: the component renders
		render(Component);

		// When: user clicks the button
		const button = screen.getByRole('button');
		fireEvent.click(button);

		// Then: should trigger the action
		expect(/* assertion */).toBe(true);
	});
});
```

### Guidelines

- **Given**: Setup and preconditions (comment describing initial state)
- **When**: Action or trigger (comment describing user action or implicit page load)
- **Then**: Expected outcome (`it` block description starts with "should", comment before assertions)
- Use comments inside tests to clarify Given/When/Then sections
- Keep test structure flat with a single `describe` block per component
- **Prefer `data-testid` over `querySelector`** - when a testing-library query (`getByRole`, `getByText`, etc.) is ambiguous or unavailable, add a `data-testid` attribute to the element and use `getByTestId` instead of raw DOM queries
