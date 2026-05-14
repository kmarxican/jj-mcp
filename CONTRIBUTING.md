# Contributing to jj-mcp

Thanks for your interest in contributing! This document outlines the process for contributing to this project.

## Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/kmarxican/jj-mcp.git
   cd jj-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Verify your setup:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

## Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes and ensure they pass all checks:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   ```

3. Commit your changes (pre-commit hooks will run automatically):
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

4. Push to your fork and open a pull request

## Code Style

- **ESLint**: Enforces code quality and consistency
- **Prettier**: Handles formatting automatically
- **TypeScript**: Strict mode enabled, explicit return types required

Pre-commit hooks will automatically fix formatting issues. ESLint errors must be resolved manually.

## Testing

All new functionality should include tests. Tests are written with Vitest:

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test changes
- `refactor:` Code refactoring
- `chore:` Build/dependency changes

## Pull Request Process

1. Ensure all CI checks pass
2. Update CHANGELOG.md with your changes
3. Request review from maintainers
4. Address review feedback
5. Squash commits if requested

## Questions?

Open an issue for discussion before large changes.
