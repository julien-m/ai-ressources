---
extends: []
---
# Logging & Sensitive Data Rules (Delta)

> These rules complement [`general.md`](general.md) §19 (Logging) and §22 (Security). Only detailed sensitive data, redaction, and compliance rules are listed here.
Logs must never become a secondary database of personal or sensitive information.

## Never Log in Clear Text
Passwords, tokens, API keys, secrets, OTP codes, session IDs, cookies, full PII (email, phone, postal address), payment data, health data, full request/response payloads containing personal data, private document contents.

## Data Minimization
- No personal data in logs unless strictly necessary for operations
- Prefer correlation data (`requestId`, `traceId`, `jobId`, `errorCode`) over user-identifying data
- When an identifier is needed for debugging, prefer redacted, truncated or hashed forms

## Structured Logging
- Use structured logs with explicit fields: `event`, `level`, `requestId`, `traceId`, `jobId`, `errorCode`, `durationMs`
- Never dump entire objects into logs

## Redaction
- Sensitive fields redacted automatically via centralized redaction rules
- Common sensitive keys masked before logging

## Request and Payload Logging
- Never log raw request bodies, headers or query parameters by default
- Never log authorization headers, cookies, tokens or secrets
- Only log explicitly whitelisted fields when request context is needed

## Error Logging
- Error logs must not include raw sensitive payloads
- Exceptions logged with safe context only
- SQL queries and parameters must not expose personal or secret data

## Environment Awareness
- Production logs stricter than development logs
- Development logs must still never expose secrets or high-risk sensitive data

## Compliance
- Follow data minimization principles
- Logs must remain compatible with privacy and data protection obligations (GDPR-oriented minimization)
