# Teddy Project Guidelines

## Commands
- Start app: `bun start`
- Run all tests: `bun test`
- Run single test: `bun vitest src/requests/send.test.ts`
- Lint: `bun run lint`
- Format: `bun run format`
- Build package: `bun run package`
- Build for distribution: `bun run make`

## Code Style
- **Imports**: External first, then internal. Use absolute imports with `@/` prefix
- **Components**: React functional components with explicit TypeScript props
- **Styling**: Tailwind CSS with `cn()` utility for conditional classes
- **Types**: Use interfaces for objects, explicit return types, union types for specific values
- **Naming**: PascalCase for components/interfaces, camelCase for functions/variables
- **Error handling**: Try/catch with consistent formatting, return `{ error, response }` objects
- **Testing**: Vitest with descriptive test names, mocks via `vi.fn()` and `vi.stubGlobal()`
- **Components**: Follow shadcn/ui patterns with forwarded refs and Radix UI primitives

Keep code DRY, use consistent error patterns, and maintain strong typing throughout.