---
name: signal-lab-orchestrator
description: Breaks PRD into atomic tasks and assigns execution order with context economy
---

# Orchestrator Skill

## When to Use
Use when:
- starting a PRD
- implementing full feature
- coordinating multi-step backend + frontend + observability work

---

## Core Idea

Do NOT implement features directly.

Instead:

1. Analyze PRD
2. Split into atomic tasks
3. Assign model type:
   - fast → simple CRUD, metrics, UI
   - default → architecture, integration
4. Execute step-by-step
5. Store state in context.json

---

## Task decomposition rules

Each task must be:
- 5–10 minutes max
- single responsibility
- testable independently

---

## Example decomposition

Feature: "Add slow_request"

Tasks:
1. Add API type enum (fast)
2. Add delay logic (fast)
3. Add Prisma save (fast)
4. Add metric histogram (fast)
5. Add log event (fast)
6. Add frontend option (fast)
7. Update history UI (fast)

---

## Context persistence

Store state:

```json
{
  "currentPhase": "implementation",
  "completedTasks": 3
}