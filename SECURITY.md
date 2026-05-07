# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest on `main` | Yes |
| Older tagged releases | Best effort |

## Reporting a Vulnerability

Please do **not** open a public GitHub issue for security vulnerabilities.

Report vulnerabilities privately by email to **markyu0615@gmail.com** with:
- a description of the issue and impact
- reproduction steps or proof of concept
- any suggested fix if available

You should receive an acknowledgement within 72 hours for valid reports.

## Scope

This app centers on shared-room collaboration and canvas editing. The most relevant areas are:
- room-link access and unintended exposure of shared content
- unsafe handling of uploaded images or imported content
- client-side injection or rendering issues in collaborative UI
- accidental exposure of Liveblocks credentials or project configuration

## Out of Scope

- security issues in third-party hosting or Liveblocks infrastructure itself
- vulnerabilities requiring direct access to a user's local machine

## Disclosure Guidance

Please allow time for investigation and remediation before public disclosure. Confirmed fixes should be reflected in release notes and the changelog when appropriate.
