# Security Policy

## Supported Versions

We provide security updates for the following versions of Keypress Notifications:

| Version | Supported          | Node.js Compatibility               |
| ------- | ------------------ | ----------------------------------- |
| 2.0.x   | :white_check_mark: | Node.js 22, 24, 26 — VS Code 1.111+ |
| 1.1.x   | :x:                | —                                   |
| 1.0.x   | :x:                | —                                   |

## Reporting a Vulnerability

We take the security of the Keypress Notifications VS Code extension seriously. If you believe you have found a security vulnerability, please follow these steps:

1. **DO NOT** disclose the vulnerability publicly.
2. Send a detailed description of the vulnerability to vijayanand431@gmail.com.
3. You should receive a response within 48 hours.
4. Please provide sufficient information to reproduce the vulnerability.

## What to Include in Your Report

When reporting a vulnerability, please include:

- A clear description of the vulnerability
- Steps to reproduce the issue
- VS Code version and Keypress Notifications version
- Node.js version (if relevant to the vulnerability)
- Operating system and platform information
- Potential impact of the vulnerability
- Any potential solutions you have identified

## Our Commitment

- We will acknowledge receipt of your vulnerability report within 48 hours.
- We will provide regular updates about our progress.
- We will maintain confidentiality of the issue until a fix is released.
- We will credit you (if desired) when we disclose the issue.

## Safe Harbor

We support safe harbor for security researchers who:

1. Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services.
2. Only interact with accounts you own or with explicit permission of the account holder.
3. Report any vulnerability promptly.
4. Do not access, modify, or delete data beyond what is necessary to demonstrate the vulnerability.

## Security Considerations

Keypress Notifications extension:

- Only intercepts VS Code command dispatch events within your local editor session
- Does not transmit any data externally — no telemetry, no network requests
- Only reads VS Code workspace configuration (keypress-notifications.\* settings)
- Follows VS Code extension security best practices

## Updates and Notifications

Security updates will be released through:

- GitHub Security Advisories
- Extension changelog (CHANGELOG.md)
- VS Code Marketplace updates
- GitHub releases with security tags

## Node.js Compatibility and Security

This extension supports Node.js 22, 24, and 26, and VS Code 1.111 and later. Security updates maintain compatibility across this range. If you are using an unsupported version, please upgrade to receive security updates.

Thank you for helping keep Keypress Notifications and its users safe!
