---
type: issue
project: "[[SSO Migration]]"
status: workaround
severity: medium
found: 2026-11-23
fixed: 
ticket: 
notify:
  - "[[Tom Becker]]"
---
# Test IdP clock skew rejects assertions
**Notify:** [[Tom Becker]]
> *status: open → workaround → fixed. Set `fixed:` to the date when resolved. People in `notify` see this issue on their page.*

## Symptoms
- About 1 login in 5 fails with *assertion NotBefore is in the future*

## Steps to reproduce
1. 

## Cause
- 

## Workaround
- Allow 2 minutes of clock skew on the SP (`infra/sso/README.md`)

## Fix / follow-up
- [ ] Ask Tom's team to fix NTP on the test IdP 📅 2026-12-01
