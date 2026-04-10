---
name: add-endpoint-skill
description: Creates a NestJS endpoint with Prisma + validation + observability wiring
---

# Add Endpoint Skill

## When to Use
Use when adding:
- new API endpoint
- new scenario type
- new backend feature

---

## Steps

### 1. Create DTO

```ts
export class CreateScenarioDto {
  type: string;
  name?: string;
}