# Teddy Project Guidelines

## Commands

- Start app: `bun start`
- Run all tests: `bun run test`
- Run single test: `bun run test src/requests/send.test.ts`
- Lint: `bun lint`
- Format: `bun format`
- Build package: `bun run package`
- Build for distribution: `bun run make`

## Code Style

- **Imports**: External first, then internal. Use absolute imports with `@/`
  prefix
- **Components**: React functional components with explicit TypeScript props
- **Styling**: Tailwind CSS with `cn()` utility for conditional classes
- **Types**: Use interfaces for objects, explicit return types, union types for
  specific values
- **Naming**: PascalCase for components/interfaces, camelCase for
  functions/variables
- **Error handling**: Try/catch with consistent formatting, return
  `{ error, response }` objects
- **Testing**: Vitest with descriptive test names, mocks via `vi.fn()` and
  `vi.stubGlobal()`
- **Components**: Follow shadcn/ui patterns with forwarded refs and Radix UI
  primitives

Keep code DRY, use consistent error patterns, and maintain strong typing
throughout.

- You can install shadcn/ui component using the shadd command. "bun shadd
  scroll-area"

- Always use bracers for controls statements like "if".

Be generous with blank lines. Separate different parts by blank lines. Always
put a blank line after const groups

```
const a = 1
const b = 2

print(a, b)
```

Sort everything like fields and functions in alphabetical order by default

Put public (exported) functions and variables and interfaces at the top of the
file.

For React props, put key and ref first. The rest in alphabetical order.
Callbacks/functions last

```
<ListItem
  key={item.id}
  date={item.createdAt}
  title={item.title}
  onClick={() => {}}
/>
```

- When running the tests suite use "bun run test run" or "bun run test run
  --coverage" for non-interactive mode
