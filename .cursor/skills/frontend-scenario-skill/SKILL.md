---
name: frontend-scenario-skill
description: Builds UI for scenario execution using RHF + TanStack Query + shadcn/ui
---

# Frontend Scenario Skill

## When to Use
Use when:
- creating scenario UI
- adding forms
- adding API calls
- updating history list

---

## Steps

### 1. Form setup (React Hook Form)

- Select: scenario type
- Input: optional name
- Button: Run

---

### 2. Mutation (TanStack Query)

- useMutation → POST /api/scenarios/run
- invalidate query after success

---

### 3. UI components (shadcn)

Must use:
- Button
- Card
- Select
- Badge

---

### 4. History list

Fetch last 20 runs:

```ts
GET /api/scenarios/history