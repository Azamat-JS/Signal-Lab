# After Scenario Change Hook

## Trigger
When scenario logic is added/modified.

---

## Enforce

Each scenario MUST update:
- Prisma schema (if needed)
- metric name consistency
- log structure consistency
- frontend dropdown sync

---

## Output

Reminder:
"Update frontend scenario list and verify Grafana dashboard still reflects metrics."