---
type: runbook
project: 
frequency: yearly
topic: "SAML / Identity"
related:
  - "[[SSO Migration]]"
last_run: 
last_reviewed: 2026-11-24
---
# Rotate the SAML signing certificate
**📚 Knowledge Base** · **Frequency:** yearly · **Related:** [[SSO Migration]]

## What it produces / why
- 

## Inputs & prerequisites
*Access needed, source data, files that must exist first.*
- 

## Steps
1. Generate the new key pair; store it in the vault as `sso-sp-signing-<env>`.
2. Publish new SP metadata with **both** certs.
3. After the IdP picks it up (24 h), switch signing to the new cert.
4. Remove the old cert from the metadata a week later.

## Commands / queries
```sql

```

## Output: where it goes & who gets it
- 

## How to check it worked
- 

## Gotchas
- 

## 📄 Relevant documents
*Quick Capture → Document → "📘 This note". Location = file path, share/SharePoint path, or URL.*

| Document | What it is / why it's useful | Location |
| -------- | ---------------------------- | -------- |
|          |                              |          |

## 🌐 Useful links
*Quick Capture → Link → "📘 This note".*

| Link | What it is / why it's useful | URL |
| ---- | ---------------------------- | --- |
|      |                              |     |

## Run log
*`- YYYY-MM-DD — notes`. Also update `last_run` above (and `last_reviewed` when you re-check the steps).*
- 
