# After Endpoint Added Hook

## Trigger
When a new NestJS controller endpoint is created or modified.

---

## Actions

Verify endpoint includes:

1. Prisma persistence (if domain requires it)
2. Observability integration:
   - metric increment
   - structured logging
   - duration tracking
3. Error handling logic exists

---

## If missing observability:

Raise warning:
"Endpoint is NOT observability-complete. Run /check-obs."