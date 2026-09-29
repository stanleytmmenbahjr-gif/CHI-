# Security Audit Report

Audit date: 2026-09-29  
Scope: Vue 3/Vite public website, Express contact API, Resend integration, repository configuration, and production dependencies. This is a source/configuration review plus automated checks, not a penetration test or infrastructure certification.

## Summary

**Security score: 82/100, conditional on credential rotation and production Redis setup.** No exploitable dependency advisory at or above high severity was reported by the npm audit checks run for this review. The application now has request validation, HTML escaping for email output, strict origin allowlists, rate limiting, request-size limits, security headers, compressed responses, structured redacted logging, and automated security checks.

Production rate limiting requires a shared Redis service. Production startup intentionally fails if Redis, allowed frontend origins, or email settings are missing. The score is conditional because Redis and deployment origins still need to be configured in Render, and a Resend key was previously exposed in local tooling output.

## Findings and Fixes

| Severity | Finding | Fix / Status |
| --- | --- | --- |
| High | A Resend API key was exposed in a previous local tooling output. | The local key value was cleared. Treat the old key as compromised: revoke it in Resend, issue a replacement, and store the replacement only in backend environment secrets. Do not reuse the exposed key. Rotation remains an operator action. |
| High | The original rate limiter used per-process memory and would not coordinate across scaled instances. | Production now requires Redis and uses `rate-limit-redis`; the in-memory store is reserved for local development/tests. Configure `REDIS_URL` in Render. |
| Medium | Provider failures could log raw provider error text. | Application logs now use an allowlist of structured fields and never log request bodies, sender addresses, IPs, or provider messages. Resend SDK diagnostics should still be reviewed when upgrading its SDK. |
| Medium | Environment settings were not centrally validated before production startup. | Zod-backed parsing validates ports, sender/recipient addresses, exact CORS origins, Redis URL scheme, and required production settings. Startup fails closed for missing production Redis, origins, or mail configuration. |
| Medium | The API had no response compression or automated security scanning. | Compression is enabled; GitHub Actions now runs npm audits, API tests, a secret scan, and CodeQL. |
| Low | Browser policies and request behavior could be hardened further. | Helmet, HSTS in production, Permissions-Policy, Referrer-Policy, no-store API responses, JSON body limits, and request IDs are configured. `X-Powered-By` is disabled. |

## OWASP Top 10 Review

- **A01 Broken access control:** No privileged/admin endpoints are present. CORS is restricted to configured exact origins; CORS is not treated as authentication.
- **A02 Cryptographic failures:** Secrets remain server-side. Use HTTPS at the hosting edge, keep the Resend key in Render secrets, and rotate the previously exposed key.
- **A03 Injection:** Zod validates and normalizes inputs. User-controlled values are HTML-escaped in HTML emails; email subject category is an enum.
- **A04 Insecure design:** Contact abuse is mitigated with a honeypot, a per-IP rate limit, a strict payload cap, and a minimal public API surface.
- **A05 Security misconfiguration:** Helmet, explicit CORS, production environment validation, disabled `X-Powered-By`, no-store API responses, and safe JSON errors are configured.
- **A06 Vulnerable components:** The audit run found zero high-severity production dependency advisories. CI rechecks dependencies on pushes, pull requests, and a weekly schedule.
- **A07 Identification/authentication failures:** The public contact endpoint has no account authentication and receives no session cookies; rate limiting is applied because it is an unauthenticated email-sending action.
- **A08 Software/data integrity failures:** Build, tests, CodeQL, dependency review via npm audit, and secret scanning run in GitHub Actions. Protect the default branch and review dependency updates.
- **A09 Security logging/monitoring failures:** Structured request logs include request ID, method, path, status, and duration only. They exclude body, email, IP, and provider error strings.
- **A10 SSRF:** The API does not fetch user-supplied URLs or arbitrary resources.

## Production Deployment Requirements

1. Revoke the previously exposed Resend key and create a replacement.
2. Verify a sender domain in Resend and set `RESEND_FROM_EMAIL` to an address on that verified domain. Do not use a free Gmail address as the sender.
3. Provision managed Redis and set `REDIS_URL` in Render. Production will not start without it.
4. Set `CLIENT_ORIGINS` to the exact HTTPS frontend origin(s), with no wildcard or URL paths.
5. Keep all secrets in hosting environment settings; never commit `.env` files or expose secrets as `VITE_*` variables.
6. Confirm TLS, DNS, backups/alerts, and provider sending limits in the hosting and Resend accounts.

## Residual Risks

- CORS only constrains browsers; it is not an access-control mechanism. The endpoint remains public and depends on rate limiting, the honeypot, and provider controls.
- The default rate limit is five requests per IP per 15 minutes. Tune it based on observed legitimate traffic and monitor abuse.
- The health endpoint is a liveness check; it does not expose secrets or verify mail delivery. Monitor Resend delivery independently.
- An actual end-to-end email was not sent during the audit. Verify delivery after key rotation, sender-domain verification, and Redis configuration.
- The score is a source-level snapshot, not a guarantee against future vulnerabilities or a substitute for an external penetration test.

## Audit Commands

```sh
npm audit --audit-level=high
npm --prefix backend audit --audit-level=high
npm --prefix backend test
npm run build
```