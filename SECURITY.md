# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **Email**: Open an issue on the repository or contact the maintainer directly
2. **Do NOT** open a public issue for security vulnerabilities
3. Include a description of the vulnerability, steps to reproduce, and potential impact

## Security Measures

This application implements the following security practices:

- **No server-side data collection** — data is stored in Supabase with Row Level Security (RLS)
- **XSS prevention** — all user inputs are escaped before rendering
- **No authentication tokens exposed** — Supabase anon keys are designed to be public-facing
- **HTTPS enforced** — deployed via Render with automatic TLS
- **No cookies or tracking** — privacy-first design
- **Content Security Policy** — static assets served with appropriate headers

## Dependencies

This project uses minimal dependencies:
- **Express.js** — web server
- **Supabase JS** — database client (via CDN)

Dependencies are regularly reviewed for known vulnerabilities.
