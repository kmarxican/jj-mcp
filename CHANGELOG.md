# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- ESLint + Prettier configuration for code quality
- Vitest test suite with mocked child_process
- GitHub Actions CI/CD pipeline
- Husky pre-commit hooks with lint-staged
- Enhanced error handling in `runJj()` for spawn errors
- Type-safe error handling with proper `unknown` type guards
- CONTRIBUTING.md and SECURITY.md documentation

### Changed

- Updated all dependencies to latest compatible versions
- Migrated to ESLint flat config format
- Improved nullish coalescing operator usage (`??`)
- Removed unnecessary `async` keywords from sync handlers

### Fixed

- Fixed ESLint errors for explicit return types
- Fixed template literal type safety for error messages
- Fixed case block lexical declarations

## [1.0.4] - 2024-01-15

### Added

- Initial release with full Jujutsu VCS tool coverage
- MCP tools for all major jj commands
- Resource handlers for repository state
- Git integration tools

[Unreleased]: https://github.com/kmarxican/jj-mcp/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/kmarxican/jj-mcp/releases/tag/v1.0.4
