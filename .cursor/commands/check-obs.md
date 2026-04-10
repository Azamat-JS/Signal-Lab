## Purpose
Verify that endpoint or feature is observability-complete.

---

## Checklist

- [ ] Prisma write exists (if domain requires persistence)
- [ ] Prometheus metric exists
- [ ] Structured log exists (JSON)
- [ ] Error path handled
- [ ] Duration tracked
- [ ] Sentry used ONLY for system_error

---

## Output

Return:
- PASS or FAIL
- list of missing observability parts