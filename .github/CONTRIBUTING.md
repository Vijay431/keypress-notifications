# 🤝 Contributing to Keypress Notifications

First off, thank you for considering contributing to Keypress Notifications! 🎉 It's people like you that make this extension better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [How to Contribute](#-how-to-contribute)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Development Guidelines](#-development-guidelines)
- [Testing](#-testing)
- [Code Style](#-code-style)
- [Community](#-community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [vijayanand431@gmail.com](mailto:vijayanand431@gmail.com).

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 20.0.0 or higher
- **npm**: Latest version (comes with Node.js)
- **VS Code**: Version 1.90.0 or higher
- **Git**: For version control

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension.git
cd vscode-keypress_snackbar_notification-extension

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start development
npm run test:dev
```

## 🛠️ Development Setup

### 1. Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vscode-keypress_snackbar_notification-extension.git
   cd vscode-keypress_snackbar_notification-extension
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build and Test

```bash
# Build the extension
npm run build

# Run all tests
npm test

# Manual testing with extension host
npm run test:manual
```

### 4. Development Workflow

```bash
# Watch mode for development
npm run watch

# Combined development workflow
npm run test:dev  # Watch + manual testing
```

## 🎯 How to Contribute

### Types of Contributions

We welcome many types of contributions:

- 🐛 **Bug Reports**: Help us identify and fix issues
- ✨ **Feature Requests**: Suggest new functionality
- 🔧 **Bug Fixes**: Submit fixes for known issues
- 📚 **Documentation**: Improve guides, examples, and API docs
- 🧪 **Tests**: Add or improve test coverage
- 🎨 **UI/UX**: Enhance user experience and design
- ⚡ **Performance**: Optimize speed and efficiency
- 🔒 **Security**: Identify and fix security issues

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Discuss major changes** by opening an issue first
3. **Follow our coding standards** (see below)
4. **Write tests** for new functionality
5. **Update documentation** when needed

## 🔄 Pull Request Process

### 1. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-number-description
```

### 2. Make Your Changes

- Follow our [coding standards](#-code-style)
- Write clear, self-documenting code
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Test manually
npm run test:manual

# Check code quality
npm run lint
npm run check-types
```

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Examples:
git commit -m "feat: add custom notification duration setting"
git commit -m "fix: resolve clipboard detection on Linux"
git commit -m "docs: update installation instructions"
git commit -m "test: add edge case coverage for keybinding detection"
```

### 5. Push and Create PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create pull request on GitHub
# Use our PR template and fill it out completely
```

### 6. Review Process

1. **Automated Checks**: CI pipeline runs tests and quality checks
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Get required approvals
5. **Merge**: Squash merge to main branch

## 🐛 Issue Guidelines

### Bug Reports

Use our bug report template and include:

- **Clear title** describing the issue
- **Environment details** (OS, VS Code version, Node.js version)
- **Steps to reproduce** the bug
- **Expected vs actual behavior**
- **Screenshots/GIFs** if applicable
- **Extension logs** if relevant

### Feature Requests

Use our feature request template and include:

- **Clear description** of the proposed feature
- **Use case** and motivation
- **Detailed specification** if complex
- **Alternative solutions** considered
- **Breaking change** implications

### Questions and Discussions

- Use **GitHub Discussions** for general questions
- Check **existing issues** before creating new ones
- Use **appropriate labels** to categorize issues

## 💻 Development Guidelines

### Architecture

Our extension follows a modular architecture:

```
src/
├── extension.ts           # Entry point
├── managers/             # High-level coordination
├── services/             # Core business logic
├── utils/               # Shared utilities
└── types/               # TypeScript definitions
```

### Key Principles

1. **Separation of Concerns**: Each module has a single responsibility
2. **Dependency Injection**: Services are injected, not imported directly
3. **Error Handling**: Graceful degradation and proper error boundaries
4. **Performance**: Minimal impact on VS Code performance
5. **Security**: No sensitive data exposure or injection vulnerabilities

### Adding New Features

1. **Design First**: Consider architecture and integration points
2. **Service Layer**: Implement core logic in services
3. **Manager Integration**: Wire up through ExtensionManager
4. **Configuration**: Add settings if user-configurable
5. **Testing**: Write comprehensive tests
6. **Documentation**: Update relevant docs

## 🧪 Testing

### Test Types

- **E2E Tests**: Full extension testing with VS Code host
- **Unit Tests**: Individual component testing
- **Integration Tests**: Service interaction testing
- **Manual Tests**: Human verification with mock workspace

### Writing Tests

```bash
# Run specific test types
npm run test:e2e         # End-to-end tests
npm run test:unit        # Unit tests (when available)
npm run test:manual      # Manual testing environment
```

### Test Guidelines

- **Test behavior, not implementation**
- **Cover happy path and edge cases**
- **Mock external dependencies appropriately**
- **Use descriptive test names**
- **Group related tests logically**

## 🎨 Code Style

### TypeScript Standards

- **Strict mode**: Full TypeScript strict configuration
- **Type safety**: Explicit types, no `any` unless absolutely necessary
- **Naming**: PascalCase for classes, camelCase for variables/functions
- **Imports**: Organized and explicit imports

### ESLint Configuration

We use enterprise-grade ESLint rules:

```bash
# Check linting
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Formatting

Prettier handles code formatting:

```bash
# Format code
npm run format
```

### Best Practices

- **Self-documenting code**: Clear variable and function names
- **Comments**: Explain "why", not "what"
- **Error handling**: Comprehensive error boundaries
- **Logging**: Structured logging with appropriate levels
- **Performance**: Avoid blocking operations on main thread

## 👥 Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Email**: [vijayanand431@gmail.com](mailto:vijayanand431@gmail.com) for sensitive matters

### Getting Help

1. **Check documentation** in README and docs/
2. **Search existing issues** for similar problems
3. **Ask in GitHub Discussions** for general questions
4. **Create detailed issue** for bugs or feature requests

### Recognition

We appreciate all contributions! Contributors will be:

- **Credited** in CHANGELOG.md for significant contributions
- **Mentioned** in release notes for major features
- **Listed** in our contributors section (coming soon!)

## 📋 Checklists

### Before Submitting a PR

- [ ] Code follows project standards
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (for significant changes)
- [ ] Conventional commit messages used
- [ ] PR template completed

### For Maintainers

- [ ] Review code quality and architecture
- [ ] Verify test coverage
- [ ] Check performance impact
- [ ] Validate security implications
- [ ] Ensure documentation completeness

## 🏆 Recognition

### Hall of Fame

We'll be adding a contributors section to recognize everyone who helps make this project better!

### Types of Recognition

- **Code Contributors**: Features, fixes, and improvements
- **Documentation Contributors**: Guides, examples, and clarity
- **Community Contributors**: Support, discussions, and advocacy
- **Testing Contributors**: Bug reports, edge cases, and validation

## 🙏 Thank You

Thank you for taking the time to contribute! Every contribution, no matter how small, makes a difference.

**Happy coding!** 🚀

---

<div align="center">

**Questions?** Reach out in [GitHub Discussions](https://github.com/Vijay431/vscode-keypress_snackbar_notification-extension/discussions) or email [vijayanand431@gmail.com](mailto:vijayanand431@gmail.com)

</div>