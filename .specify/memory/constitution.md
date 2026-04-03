# SQL Visual Lab Constitution

## Core Principles

### I. Code Quality

Apply Clean Code and S.O.L.I.D. principles when they add value. Over-engineering is strictly prohibited. Focus on maintainable, readable, and purposeful code that solves real problems without unnecessary complexity.

### II. Architecture (NON-NEGOTIABLE)

Implement "Screaming Architecture" with feature-based organization. The project structure should immediately reveal what the application does. Group related functionality by features, not by technical layers.

### III. Naming Conventions

All code must be in English (functions, constants, variables). File names must use kebab-case. No exceptions - consistency is key for maintainability and team collaboration.

### IV. React/JavaScript Syntax

Prioritize arrow functions and always use 'export const' for exports. The use of 'forwardRef' is strictly prohibited. Modern functional programming patterns are preferred over class-based approaches.

### V. Single Responsibility

Components, functions, and custom hooks must have a single responsibility. Components should be purely presentational by default. Business logic should be separated into custom hooks or utility functions.

## Development Standards

### TypeScript Requirements

Mandatory use of TypeScript with strong typing. The use of 'any' type is strictly prohibited. All interfaces, types, and function signatures must be explicitly defined.

### Tooling and MCPs

- For library installation and documentation queries: Use Context7 MCP exclusively
- For UI components: Use ShadCN MCP exclusively
- No manual installation or documentation lookup outside these tools

### Code Style and Formatting

Configure ESLint and Prettier with import sorting enabled. Include Tailwind CSS typography plugin. Follow UX/UI best practices for user experience and interface design.

## Quality Gates

### Git Workflow

Commits must be short, in English, and follow Conventional Commits standard. Examples:

- feat: add sql query builder
- fix: resolve connection timeout
- chore: update dependencies
- docs: add api documentation

### Testing Policy

Testing is prohibited unless explicitly requested. Focus development time on feature delivery and code quality rather than test coverage.

## Governance

This constitution supersedes all other development practices and guidelines. All code reviews and pull requests must verify compliance with these principles.

Complexity must be justified and documented. When in doubt, choose simplicity over sophistication.

**Version**: 1.0.0 | **Ratified**: April 3, 2026 | **Last Amended**: April 3, 2026
