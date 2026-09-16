# Security Policy

## Supported Version

Security fixes target the latest commit on `main`. Older commits and tags are reference snapshots and do not receive separate maintenance.

## Report a Vulnerability

Use [GitHub private vulnerability reporting](https://github.com/julien-m/ai-ressources/security/advisories/new) when it is available. Include affected paths, impact, reproduction details, and a suggested mitigation. Do not open a public issue containing secrets, personal data, or working exploit details.

If private reporting is unavailable, open a minimal [security-contact issue](https://github.com/julien-m/ai-ressources/issues/new) that contains no sensitive details and asks the maintainer to establish a private channel. Non-sensitive hardening suggestions may use a normal issue.

## Response and Disclosure

The maintainer will acknowledge a report when available, assess scope, and coordinate a fix and disclosure timeline with the reporter. No guaranteed response time or bug bounty is offered.

## Automated Checks and Limits

- Pull requests and scheduled CI are configured for dependency and secret/filesystem checks.
- These checks reduce risk but do not prove that the repository is vulnerability-free.
- A workflow configuration is not evidence that a scan ran; consult the corresponding GitHub Actions run for results.
- Never commit credentials. Rotate a credential immediately if it enters Git history, even if a later commit removes it.
