# Agent Guidelines

## Commands

- **Build**: `npm run build` (runs astro check + build)
- **Lint**: `npm run lint` and `npm run lint:fix`
- **Test**: `npm run test` (vitest)
- **Single test**: `npm run test -- [test-file]` or `npm run test -- --run [test-file]`
- **Dev**: `npm run dev`

## Code Style

- **Imports**: Use `@/*` path aliases for src imports (e.g., `@models/type`, `@components/GiftsTable`)
- **Formatting**: Prettier with 2-space tabs, double quotes, semicolons
- **TypeScript**: Strict mode enabled, React JSX with `react-jsx` runtime
- **Components**: Astro components for pages/markup, React TSX for interactive UI
- **Error handling**: Use try/catch with proper error boundaries, redirect to `/forbidden` for auth failures
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Database**: Drizzle ORM with SQLite, use `@models/*` for schema/types

## Testing

- Vitest with React Testing Library
- Test files in `src/__tests__/` with `.test.ts/.tsx` extension
- Use `@testing-library/*` for component testing
- Setup file: `vitest.setup.ts`

## Key Patterns

- Use `cn()` utility for Tailwind class merging
- Date formatting with `formatDate()` and `dateRange()` helpers
- Auth via URL params + server-side verification
- Environment variables via `.env` files
