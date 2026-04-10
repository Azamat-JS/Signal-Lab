---
name: observability-skill
description: Adds metrics, logs, and Sentry integration to any backend endpoint in Signal Lab
---

# Observability Skill

## When to Use
Use this skill whenever you create or modify a backend endpoint that affects:
- scenario execution
- API routes
- business logic that needs tracking

---

## What this skill enforces

Every endpoint MUST:

1. Emit a Prometheus metric
2. Write a structured log
3. Optionally send Sentry event (only if error)
4. Measure execution time

---

## Implementation Steps

### 1. Add timing measurement
Start timer at request entry:

```ts
const start = Date.now();