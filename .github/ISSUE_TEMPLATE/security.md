---
name: Security Vulnerability
about: Report a security vulnerability that is not critical
title: '[SECURITY] '
labels: security
assignees: ''
---

## ⚠️ Important Security Notice

**For CRITICAL or HIGH severity vulnerabilities**, please email vijayanand431@gmail.com directly instead of using this template.

This template is for:

- Minor security concerns
- Security best practices
- Potential security improvements
- Documentation about security

## Vulnerability Type (check one)

- [ ] **Potential Vulnerability** - Suspected but not confirmed security issue
- [ ] **Best Practice Concern** - Code doesn't follow security best practices
- [ ] **Information Disclosure** - Sensitive information could be exposed
- [ ] **Input Validation** - Missing or insufficient input validation
- [ ] **Dependency Issue** - Security concern with dependencies
- [ ] **Code Quality** - Code that could lead to security issues
- [ ] **Documentation** - Security documentation needed

## Vulnerability Description

Describe the security concern clearly.

**Summary:**
Brief description of the security issue.

**Impact:**
What is the potential impact of this vulnerability?

- [ ] Information disclosure
- [ ] Code execution
- [ ] Data corruption
- [ ] Other: ______

**Severity:**

- [ ] Low - Minimal impact
- [ ] Medium - Moderate impact
- [ ] High - Significant impact (use email for critical)

## Affected Component

Which part of the extension is affected?

- [ ] KeypressService (command detection/throttling)
- [ ] ConfigurationService (settings access)
- [ ] AccessibilityService
- [ ] CommandRegistry
- [ ] ExtensionManager
- [ ] DI container
- [ ] Logger / output channel
- [ ] Other: ______

## Reproduction Steps

If applicable, how can this vulnerability be demonstrated?

1. ___
2. ___
3. See vulnerability

## Environment

- **VS Code:** Version
- **Extension:** Version
- **OS:** Windows/macOS/Linux

## Mitigation

**Current Mitigation:**
Are there any workarounds or mitigations?

**Proposed Fix:**
How should this be fixed?

## Additional Context

**References:**
Link to relevant security standards, CVEs, or documentation.

**Related Issues:**
Link to related GitHub issues or PRs.

## Privacy Consent

- [ ] I consent to being credited for this vulnerability discovery
- [ ] I prefer to remain anonymous
