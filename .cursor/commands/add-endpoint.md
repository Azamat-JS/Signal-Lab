## Purpose
Scaffold a new NestJS endpoint with full Prisma + observability integration.

---

## Steps

1. Create DTO in `/dto`
2. Create controller method
3. Create service method (ALL logic here)
4. Add Prisma write if needed
5. Add observability (MANDATORY):
   - metric increment
   - structured log
   - duration tracking
6. Add Swagger annotation
7. Add frontend hook if needed

---

## Rules

- No logic in controller
- Must use Prisma service only
- Must include observability-skill
- Must pass review-observability-skill