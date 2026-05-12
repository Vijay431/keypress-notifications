# 🔒 Security Policy

## 🛡️ Reporting Security Vulnerabilities

The security of Keypress Notifications is a top priority. We appreciate your efforts to responsibly disclose security vulnerabilities.

### 📧 Private Disclosure

**Please do NOT create public GitHub issues for security vulnerabilities.**

Instead, please report security issues privately to:

- **Email**: [vijayanand431@gmail.com](mailto:vijayanand431@gmail.com)
- **Subject**: `[SECURITY] Keypress Notifications - [Brief Description]`

### 📋 What to Include

When reporting a security vulnerability, please include:

1. **Description**: Clear description of the vulnerability
2. **Impact**: Potential impact and affected components
3. **Reproduction**: Step-by-step instructions to reproduce
4. **Environment**: VS Code version, OS, Node.js version
5. **Evidence**: Screenshots, logs, or proof-of-concept (if safe)
6. **Severity**: Your assessment of the vulnerability severity

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Triage**: Within 1 week
- **Fix Development**: Depends on severity (1-4 weeks)
- **Release**: Coordinated disclosure after fix

## 🔍 Supported Versions

| Version | Supported |
| ------- | --------- |
| 2.x.x   | ✅ Yes    |
| 1.0.x   | ❌ No     |
| 0.x.x   | ❌ No     |

## 🛡️ Security Measures

### 🏗️ Development Security

- **Dependency Scanning**: Automated vulnerability detection
- **Code Analysis**: Static analysis for security issues
- **Dependency Updates**: Regular security updates via Renovate
- **Audit Pipeline**: npm audit in CI/CD pipeline

### 🔒 Runtime Security

- **No Network Requests**: Extension operates entirely offline
- **Local Data Only**: No external data transmission
- **VS Code API Only**: Uses only official VS Code APIs
- **No Shell Execution**: No system command execution
- **Input Validation**: All inputs validated and sanitized

### 📦 Distribution Security

- **Official Marketplace**: Distributed only through official VS Code Marketplace
- **Signed Releases**: All releases are signed and verified
- **Reproducible Builds**: Build process is transparent and reproducible
- **Source Code**: Fully open source for security review

## 🚨 Known Security Considerations

### ⚠️ Potential Risk Areas

1. **Command Interception**: Extension intercepts VS Code commands
   - **Mitigation**: Only monitors common multi-key commands
   - **Scope**: Limited to built-in VS Code operations (clipboard, navigation, file ops)

2. **Configuration Storage**: Extension stores user preferences
   - **Mitigation**: Uses VS Code's secure configuration system
   - **Scope**: Only extension settings, no sensitive data

3. **Logging**: Extension may log basic debugging information
   - **Mitigation**: No sensitive data logged, basic operation info only
   - **Scope**: Local VS Code output channel only

### ✅ Security Features

- **No External Dependencies**: Minimal attack surface
- **No Data Collection**: Zero telemetry or data collection
- **Sandboxed Environment**: Runs in VS Code's extension sandbox
- **Permission Model**: Limited to required VS Code APIs only

## 🔐 Security Best Practices for Users

### 💡 Recommendations

1. **Keep Updated**: Always use the latest version
2. **Official Source**: Install only from VS Code Marketplace
3. **Review Permissions**: Check extension permissions before installing
4. **Monitor Activity**: Review VS Code output channel if concerned
5. **Report Issues**: Report any suspicious behavior immediately

### 🚫 What We Don't Do

- **No Data Collection**: We don't collect any user data
- **No Network Access**: No external network requests
- **No File System Access**: Only VS Code workspace interaction
- **No System Calls**: No direct operating system access
- **No Third-party Services**: No external service dependencies

## 🔄 Security Update Process

### 📊 Severity Levels

| Severity    | Response Time | Release Timeline |
| ----------- | ------------- | ---------------- |
| 🔴 Critical | 24 hours      | 1-3 days         |
| 🟠 High     | 48 hours      | 1 week           |
| 🟡 Medium   | 1 week        | 2 weeks          |
| 🟢 Low      | 2 weeks       | Next release     |

### 🚀 Update Distribution

1. **Hotfix Release**: Critical vulnerabilities get immediate patches
2. **Security Advisory**: GitHub Security Advisory published
3. **User Notification**: VS Code auto-update mechanism
4. **Documentation**: Security fix details in CHANGELOG.md

## 📚 Security Resources

### 🔍 Security Audits

- **Automated Scanning**: Continuous vulnerability scanning
- **Dependency Analysis**: Regular dependency security review
- **Code Review**: Security-focused code review process
- **Third-party Audit**: Open to independent security audits

### 📖 Reference Materials

- [VS Code Extension Security](https://code.visualstudio.com/api/references/extension-manifest#extension-security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Guidelines](https://docs.npmjs.com/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 🏆 Security Recognition

### 🙏 Hall of Fame

We recognize security researchers who help improve our security:

_Coming soon - first security reporter will be featured here!_

### 🎁 Recognition Program

While we don't offer monetary rewards, we provide:

- **Public Recognition**: Listed in security acknowledgments
- **Contributor Status**: Recognized as a security contributor
- **Early Access**: Beta access to new features
- **Direct Communication**: Priority support channel

## 📞 Contact Information

### 🔒 Security Team

- **Primary Contact**: [vijayanand431@gmail.com](mailto:vijayanand431@gmail.com)
- **PGP Key**: Available upon request
- **Response Time**: Within 48 hours

### 🌐 Additional Resources

- **Project Repository**: [GitHub](https://github.com/Vijay431/keypress-notifications)
- **Issue Tracker**: [GitHub Issues](https://github.com/Vijay431/keypress-notifications/issues) (for non-security issues)
- **Documentation**: [README.md](../README.md)

## 🔄 Policy Updates

This security policy may be updated from time to time. Check this document regularly for the latest security information.

**Last Updated**: September 28, 2024

---

<div align="center">

**Security is a shared responsibility. Thank you for helping keep Keypress Notifications secure!** 🛡️

</div>
