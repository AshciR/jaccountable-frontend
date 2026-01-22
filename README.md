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

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

```sh
npm install
```

### Development

Start the development server:

```sh
npm run dev
```

Or start the server and open the app automatically:

```sh
npm run dev -- --open
```

### Building for Production

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Testing

This project uses [Vitest](https://vitest.dev/) with [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/) for component testing.

### Running Tests

```sh
npm run test        # Run tests once
npm run test:watch  # Run tests in watch mode
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
