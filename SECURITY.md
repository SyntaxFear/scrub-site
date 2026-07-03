# Security Policy

This repository includes the Scrub public website, release downloads, update
feed, and native-auth backend code.

## Supported Versions

Security fixes are handled on the default branch first. Production deployments
should be redeployed from the latest fixed commit.

## Secrets

Do not commit `.env`, `.env.local`, Convex credentials, Apple auth secrets, AWS
SES credentials, analytics keys, or admin API keys. Use `.env.example` as a list
of required names only.

## Reporting a Vulnerability

Please do not open a public issue for a vulnerability or for a report that
includes credentials, tokens, private user data, or unreleased signing details.

Use GitHub's private vulnerability reporting or contact the maintainer through
the SyntaxFear GitHub profile. Include:

- What you found
- Steps to reproduce it
- Whether it affects the website, download flow, update feed, or auth backend
- Any logs or screenshots with private data removed

The maintainer will confirm receipt, investigate, and coordinate a fix before
public disclosure.
