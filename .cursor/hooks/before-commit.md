# Before Commit Hook

## Trigger
Before code is committed.

---

## Checks

### Security
- No hardcoded secrets
- No .env values committed

---

### Prisma
- Migration applied if schema changed

---

### Observability
- Every endpoint has:
  - metric OR log OR both
- system_error paths send to Sentry

---

## If violation found

Block commit and output:
- reason
- file affected
- fix suggestion