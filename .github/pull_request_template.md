# 🔄 Pull Request

## 📋 Summary

<!-- Provide a brief description of the changes in this PR -->

## 🎯 Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] 🐛 **Bug fix** (non-breaking change that fixes an issue)
- [ ] ✨ **New feature** (non-breaking change that adds functionality)
- [ ] 💥 **Breaking change** (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 **Documentation** (changes to documentation only)
- [ ] 🎨 **Style/UI** (formatting, missing semicolons, white-space, etc.)
- [ ] ♻️ **Refactoring** (code change that neither fixes a bug nor adds a feature)
- [ ] ⚡ **Performance** (changes that improve performance)
- [ ] 🧪 **Tests** (adding missing tests or correcting existing tests)
- [ ] 🔧 **Configuration** (changes to build process, CI, etc.)
- [ ] 🔒 **Security** (security-related improvements or fixes)

## 🔗 Related Issues

<!-- Link any related issues using # (e.g., #123) -->

- Fixes #
- Related to #
- Implements #

## 🧪 Testing

<!-- Describe the tests you ran and how to reproduce them -->

### ✅ Test Cases Covered

- [ ] Manual testing performed
- [ ] Automated tests added/updated
- [ ] Cross-platform testing (Windows/macOS/Linux)
- [ ] VS Code version compatibility testing (1.102.0+)
- [ ] Performance impact assessment

### 🔧 Manual Testing Steps

1.
2.
3.

### 📊 Test Results

<!-- Provide test results, screenshots, or performance measurements -->

## 🔄 Node.js Compatibility (for development)

<!-- Check Node.js versions if making build/development changes -->

- [ ] ✅ Node.js 16.x
- [ ] ✅ Node.js 18.x
- [ ] ✅ Node.js 20.x (LTS)
- [ ] ✅ Node.js 22.x
- [ ] N/A - No development changes

## 💻 Platform Testing

<!-- Check all platforms this change has been tested on -->

- [ ] 🪟 Windows 10/11
- [ ] 🍎 macOS (latest)
- [ ] 🐧 Linux (Ubuntu/Debian)
- [ ] 🏢 WSL/Remote Development
- [ ] 🐳 Docker/Containerized environments

## 📝 Changes Made

<!-- Provide a detailed list of what was changed -->

### 🔧 Core Changes

-
-
-

### 📁 Files Modified

- `src/extension.ts` -
- `src/services/KeypressService.ts` -
- `src/types/` -
- `test/` -
- Other:

## ⚠️ Breaking Changes

<!-- If this is a breaking change, describe what breaks and how to migrate -->

**Are there any breaking changes?**

- [ ] ❌ No breaking changes
- [ ] ⚠️ Yes, breaking changes (describe below)

### Migration Guide

<!-- If breaking changes exist, provide migration instructions -->

## 📊 Performance Impact

<!-- Describe any performance implications -->

- [ ] 🟢 **No performance impact**
- [ ] 🟡 **Minor performance impact** (describe below)
- [ ] 🟠 **Significant performance impact** (describe below and justify)

### Performance Details

<!-- If there's performance impact, provide details -->

## 🔒 Security Considerations

<!-- Describe any security implications of this change -->

- [ ] ✅ No security implications
- [ ] ⚠️ Security implications reviewed and addressed
- [ ] 🔍 Security review requested

## 📚 Documentation

<!-- Check all that apply -->

- [ ] 📖 **Code is self-documenting** with clear variable/function names
- [ ] 💬 **Comments added** where code is not obvious
- [ ] 📋 **README.md updated** (if user-facing changes)
- [ ] 📝 **CHANGELOG.md updated** (if noteworthy changes)
- [ ] 🌐 **Documentation site updated** (if applicable)
- [ ] 🎯 **JSDoc/TypeScript types updated** (if applicable)

## ✅ Code Quality Checklist

<!-- Ensure all items are checked before requesting review -->

### 🧹 Code Standards

- [ ] Code follows the project's coding standards
- [ ] ESLint passes without errors
- [ ] TypeScript compilation succeeds
- [ ] No console.log or debug statements left in code
- [ ] Proper error handling implemented
- [ ] Code is DRY (Don't Repeat Yourself)

### 🧪 Testing Requirements

- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Test coverage maintained or improved
- [ ] Edge cases considered and tested
- [ ] Error conditions tested

### 📦 Build & Deployment

- [ ] Project builds successfully (`npm run build`)
- [ ] Production build works (`npm run package`)
- [ ] No new dependencies added without justification
- [ ] Package.json version updated (if releasing)

## 🎯 Reviewer Focus Areas

<!-- Help reviewers focus on specific areas that need attention -->

**Please pay special attention to:**

- [ ] Algorithm/logic correctness
- [ ] Performance implications
- [ ] Security considerations
- [ ] Breaking change impact
- [ ] Cross-platform compatibility
- [ ] Error handling
- [ ] User experience
- [ ] Code maintainability

## 📸 Screenshots/GIFs

<!-- Add screenshots or GIFs to demonstrate visual changes -->

### Before

<!-- Screenshots of current behavior -->

### After

<!-- Screenshots of new behavior -->

## 🔄 Migration Instructions

<!-- If this change affects existing users, provide migration steps -->

**For Users:**

1.
2.

**For Developers:**

1.
2.

## 🤔 Questions for Reviewers

<!-- Any specific questions you'd like reviewers to consider -->

1.
2.

## 📋 Additional Notes

<!-- Any additional context, concerns, or discussion points -->

---

## ✅ Final Checklist

<!-- Complete this checklist before marking the PR as ready for review -->

- [ ] 🎯 **PR title clearly describes the change**
- [ ] 📝 **PR description provides sufficient context**
- [ ] 🔗 **Related issues are linked**
- [ ] 🧪 **All tests pass locally**
- [ ] 📚 **Documentation is updated** (if needed)
- [ ] 🔍 **Self-review completed**
- [ ] 👥 **Ready for team review**
- [ ] 🏷️ **Appropriate labels added**
- [ ] 📦 **Milestone assigned** (if applicable)

---

## 🤝 Contribution Guidelines

**Thank you for contributing to Keypress Notifications!** 🎯

### 📋 Review Process

1. **🔍 Automated Checks** - CI pipeline runs automatically
2. **👥 Code Review** - Team members review your changes
3. **🧪 Testing** - Verify functionality across platforms
4. **✅ Approval** - Required approvals before merge
5. **🚀 Merge** - Squash merge to master branch

### 💡 Tips for Success

- 🎯 **Keep PRs focused** - One feature/fix per PR
- 📝 **Write clear descriptions** - Help reviewers understand your changes
- 🧪 **Test thoroughly** - Consider edge cases and different environments
- 💬 **Respond to feedback** - Address review comments promptly
- 🔄 **Stay updated** - Rebase on latest master if needed

### 🏷️ Labeling

Add appropriate labels to help with triage:

- `bug` - Bug fixes
- `enhancement` - New features
- `documentation` - Documentation changes
- `performance` - Performance improvements
- `breaking-change` - Breaking changes
- `needs-review` - Ready for review

**Questions?** Feel free to ask in the comments or reach out to the maintainers! 💬
