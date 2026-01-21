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
    index.ts     # $lib exports
  routes/        # SvelteKit file-based routing
    +layout.svelte
    +page.svelte
  app.html       # HTML template
  app.d.ts       # App-level type declarations
static/          # Public static files
```

## Conventions

- Use `$lib` alias for imports from `src/lib`
- Svelte 5 runes syntax (`$state`, `$derived`, `$effect`, etc.)
- File-based routing with `+page.svelte`, `+layout.svelte`, `+server.ts` conventions
- **Always create tests when creating components** - colocate test files with components using `.test.ts` suffix (e.g., `Hero.svelte` → `Hero.test.ts`)
- **Create feature components in `src/lib/components/features/`** - complex/page-level components like Hero, ChallengeSection go here
