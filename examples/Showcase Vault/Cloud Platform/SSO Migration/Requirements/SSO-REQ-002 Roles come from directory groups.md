---
type: requirement
project: '[[SSO Migration]]'
req_id: SSO-REQ-002
status: approved
priority: must
version: 2
added: 2026-11-16
last_changed: 2026-11-23
meetings:
  - '[[2026-11-16 SSO kickoff]]'
  - '[[2026-11-23 Claims mapping review]]'
people:
  - '[[Tom Becker]]'
  - '[[Jordan Ellis]]'
---
# SSO-REQ-002: Roles come from directory groups
```actions
change-requirement
```
**Project:** [[SSO Migration]] · **Added:** 2026-11-16 in [[2026-11-16 SSO kickoff]] · **From:** [[Tom Becker]]

## Current requirement
App roles are assigned from directory groups in the SAML assertion; users in no mapped group get the viewer role.

## Acceptance criteria
- 

## Notes
- 

## Version history
*To record a change: press **Change requirement** at the top (on this note, or in the meeting where it changed).*

| Ver | Date | Change | Why | Meeting | Who |
| --- | ---- | ------ | --- | ------- | --- |
| v1 | 2026-11-16 | Added (proposed, must): App roles are assigned from directory groups in the SAML assertion. |  | [[2026-11-16 SSO kickoff]] | [[Tom Becker]] |
| v2 | 2026-11-23 | Wording: was "App roles are assigned from directory groups in the SAML assertion." → now "App roles are assigned from directory groups in the SAML assertion; users in no mapped group get the viewer role."; Status: proposed → approved | Analysts outside the groups still need read access | [[2026-11-23 Claims mapping review]] | [[Tom Becker]], [[Jordan Ellis]] |

