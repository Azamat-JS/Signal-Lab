---
name: review-observability-skill
description: Validates whether endpoint is observability-ready (metrics + logs + errors)
---

# Observability Review Skill

## When to Use
Use after implementing:
- endpoint
- scenario
- backend logic change

---

## Checklist

### Must have:
- [ ] Prisma save exists
- [ ] log emitted (JSON format)
- [ ] metric incremented
- [ ] duration tracked

---

## Error rules

### system_error
- MUST appear in Sentry

### validation_error
- MUST NOT crash system
- MUST log warning

---

## Failure cases

If any missing:
→ mark endpoint as NOT production-ready