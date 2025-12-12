# Contributing to React Render Checkup

Thank you for your interest in contributing! Here are some guidelines to help you get started.

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/react-render-checkup.git
   cd react-render-checkup
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build all packages:

   ```bash
   npm run build
   ```

4. Run the example:
   ```bash
   cd example
   npm install
   npm run dev
   ```

## Project Structure

```
react-render-checkup/
├── packages/
│   ├── eslint-plugin-checkup/    # ESLint plugin
│   │   ├── src/
│   │   │   ├── rules/            # ESLint rules
│   │   │   └── index.ts          # Plugin entry
│   │   └── docs/                 # Rule documentation
│   └── react-hook-checkup/       # React hooks
│       └── src/
│           ├── useRenderCheckup.ts
│           ├── RenderTracker.ts
│           └── types.ts
├── example/                      # Demo application
└── README.md
```

## Making Changes

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they work:

   ```bash
   npm run build
   cd example && npm run dev
   ```

3. Test your changes in the example app

4. Commit your changes:
   ```bash
   git commit -m "feat: add your feature"
   ```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## Adding New ESLint Rules

1. Create a new rule file in `packages/eslint-plugin-checkup/src/rules/`
2. Add the rule to `packages/eslint-plugin-checkup/src/index.ts`
3. Create documentation in `packages/eslint-plugin-checkup/docs/rules/`
4. Add tests (TODO: test infrastructure)

## Pull Request Process

1. Ensure your code builds without errors
2. Update documentation as needed
3. Update the README if you've added new features
4. Submit a pull request with a clear description

## Questions?

Feel free to open an issue for any questions or concerns!
