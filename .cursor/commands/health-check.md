## Purpose
Verify full system integrity.

---

## Checks

Backend:
- GET /api/health returns 200
- /metrics returns Prometheus format

Database:
- Prisma connection alive

Frontend:
- loads without errors

Observability:
- Grafana reachable
- Loki reachable
- Prometheus scraping backend

---

## Output

Return status summary:
- backend: ok/fail
- frontend: ok/fail
- db: ok/fail
- observability: ok/fail