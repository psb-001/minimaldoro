# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Minimaldoro, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email: **psb001@users.noreply.github.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 1 week
- **Fix or mitigation:** Depends on severity, but typically within 2 weeks

## Security Considerations

### Data Storage
- All data is stored **locally** in a SQLite database (`better-sqlite3`)
- No data is sent to external servers
- No telemetry, analytics, or cloud sync

### Network Access
- Minimaldoro only connects to the internet for:
  - **Auto-updates** — checking and downloading from GitHub Releases
- No other network requests are made

### Code Signing
- Current releases are **not code signed**
- Windows SmartScreen may show warnings on first install — this is expected
- Code signing is planned for future releases

### Permissions
- Minimaldoro does **not** require admin privileges to run
- Auto-start uses the Windows Startup registry (current user only)

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes     |
| < 1.0   | ❌ No      |

## Best Practices for Users

- Download only from the [official GitHub Releases page](https://github.com/psb-001/minimaldoro/releases)
- Keep the app updated to the latest version
- Review the [Privacy Policy](https://github.com/psb-001/minimaldoro/blob/main/docs/index.html) for data handling details
