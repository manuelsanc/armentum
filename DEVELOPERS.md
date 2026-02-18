# Developer Guidelines - Armentum Project

## Quick Start Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Production build to dist/
```

### Testing (setup required)
```bash
npm run test                                    # Run all tests
npm run test:watch                              # Run tests in watch mode
npm run test -- src/app/pages/Home.test.tsx     # Run single test file
npm run test:coverage                           # Generate coverage report
```

### Linting & Formatting (setup required)
```bash
npm run lint              # Run ESLint
npm run format            # Run Prettier
npm run format:check      # Check formatting without changes
```

---

## Code Style Guidelines

### Imports & Exports
- **Order**: Group imports → React → External libs → Internal components → Assets
- **Named first**: `import { useState } from "react"` before `import logo from "..."`
- **Alphabetical**: Sort named imports alphabetically within groups
- **Export**: Use named exports for all components: `export function ComponentName() {}`

### Naming Conventions
- **Components**: PascalCase, descriptive (e.g., `AdminPanel`, `UserProfile`)
- **Functions/Variables**: camelCase (e.g., `handleLogin`, `userEmail`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **File names**: Match component name (e.g., `Admin.tsx`, `Login.tsx`)
- **Test files**: `ComponentName.test.tsx` (co-located with component)
- **Types**: PascalCase with `Type` or `Props` suffix (e.g., `UserType`, `LoginProps`)

### TypeScript
- **Strict mode**: Enable `strict: true` in tsconfig.json
- **Type annotations**: Always annotate function params and returns
- **Type unions**: Use for enums: `type UserRole = "admin" | "corista"`
- **Avoid `any`**: Use `unknown` if necessary, then narrow the type
- **Interfaces**: For component props; `type` for unions/primitives

### Formatting
- **Line length**: ~100 characters (Tailwind classes may exceed)
- **Indentation**: 2 spaces (configured in Prettier)
- **Semicolons**: Always use semicolons
- **Trailing commas**: Use in multi-line objects and arrays
- **Quotes**: Double quotes for JSX, single for strings

### Error Handling
- **Validation**: Check inputs before processing (see Login.tsx)
- **State management**: Store errors in component state: `const [error, setError] = useState("")`
- **User feedback**: Display errors accessibly in the UI
- **Try-catch**: Wrap async operations: `try { ... } catch (err) { setError(err.message) }`
- **No silent failures**: Always log and display errors to users

### Components
- **Functional**: Use functional components with React hooks (never class components)
- **Hooks**: `useState` for state, `useEffect` for side effects, `useNavigate` for routing
- **Destructuring**: Destructure props in function signature: `export function Component({ prop1, prop2 }) {}`
- **Styling**: Use Tailwind CSS classes only, no CSS-in-JS or styled-components
- **Accessibility**: Use semantic HTML, include ARIA labels where appropriate

---

## Recommended Setup for Agents

### ESLint + Prettier
```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
```
Then create `.eslintrc.json` and `.prettierrc.json` in project root.

### Vitest + React Testing Library
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @vitest/ui jsdom
```
Add to `vite.config.ts`: `import { defineConfig } from "vitest/config"`

### Playwright E2E Tests
```bash
npm install -D @playwright/test
npx playwright install
```

---

## Project Structure

```
src/
├── app/
│   ├── pages/              # Page components (routes)
│   │   ├── Home.tsx
│   │   ├── Admin.tsx
│   │   ├── Login.tsx
│   │   └── ...
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/Radix UI primitives
│   │   ├── Root.tsx
│   │   └── ...
│   ├── routes.tsx         # Route definitions
│   └── App.tsx            # Root component wrapper
├── assets/                # Images, icons, static files
└── main.tsx               # Entry point
```

---

## Git & CI/CD

### Workflows
- `claude.yml` - Claude Code triggered on @claude mentions
- `claude-code-review.yml` - Auto-review on pull requests

### Commit Messages
Format: `[type]: [description]`
- `feat: add user authentication`
- `fix: correct login validation error`
- `docs: update README`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Requests
- Reference issues: `Closes #123`
- Provide clear summary of changes
- Keep focused on single feature/fix

---

## Environment Variables

Create `.env.local` in project root (not committed):
```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Armentum
```

Use in code: `import.meta.env.VITE_API_URL`

---

## ⚠️ Agent Instructions

### DO NOT Modify These Files
- **`AGENTS.md`** - Multi-agent architecture reference (read-only)
- **`.github/workflows/`** - CI/CD pipelines (discuss changes first)
- **`vite.config.ts`** - Build configuration
- **`postcss.config.mjs`** - CSS pipeline
- **`package.json`** - Dependency management (coordinate first)

### When Creating New Files
- Follow naming conventions above
- Add JSDoc comments for complex functions
- Test locally before committing
- Use GitHub CLI: `gh pr create`, `gh issue close`

### Common Mistakes to Avoid
- ❌ Mixing default and named imports incorrectly
- ❌ Using `any` type in TypeScript code
- ❌ Putting complex logic inside components (extract to functions)
- ❌ Hard-coded values (use constants or .env variables)
- ❌ Not handling errors (always set error state and inform user)

---

## Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com/en/main)
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Guide](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
