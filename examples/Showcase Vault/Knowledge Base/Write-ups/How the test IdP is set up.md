---
type: writeup
kind: setup
topic: "SAML / Identity"
related:
  - "[[SSO Migration]]"
  - "[[Cloud Platform]]"
created: 2026-11-24
last_reviewed: 2026-11-24
---
# How the test IdP is set up
**📚 Knowledge Base** · setup · **Related:** [[SSO Migration]], [[Cloud Platform]]

> [!summary] TL;DR
> A throwaway SAML IdP for testing app logins without touching the real directory. Users and groups are defined in a YAML file; it restarts nightly.

## Background / context
- Apps moving to SAML ([[SSO Migration]]) need a safe place to test claims and roles.

## Prerequisites
- Container host access (ask [[Jordan Ellis]])
- The test signing cert from the vault

## Steps
1. `docker compose up -d` in `idp-test/` (SimpleSAMLphp)
2. Add test users and their groups to `idp-test/users.yaml`
3. Import the SP's metadata (e.g. `infra/sso/sp-metadata.test.xml`)
4. Rotate the signing cert yearly: [[Rotate the SAML signing certificate]]

## Config values & where they live
| Setting | Value / location |
| ------- | ---------------- |
| Setting | Value / location |
| ------- | ---------------- |
| URL | https://idp-test.example.gov |
| Users | `idp-test/users.yaml` |
| Restart | nightly 03:00 (wipes sessions) |

## How to verify
- 

## Gotchas
- Its clock drifts; allow 2 minutes of skew on the SP. See [[Test IdP clock skew rejects assertions]].

## 📄 Relevant documents
*Quick Capture → Document → "📘 This note". Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
|          |                              |          |

## 🌐 Useful links
*Quick Capture → Link → "📘 This note".*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
| Test IdP metadata | Import this into an SP to trust the test IdP | https://idp-test.example.gov/saml2/idp/metadata.php |

## Change log
*`- YYYY-MM-DD — what changed`. Update `last_reviewed` when you re-check this is still accurate.*
- 2026-11-24 — created
