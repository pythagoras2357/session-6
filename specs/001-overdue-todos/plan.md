# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2025-11-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add visual identification for overdue todo items in the existing todo application. Users need to quickly spot incomplete todos that are past their due date without manually checking dates. The feature includes three prioritized user stories: P1 - visual styling (red text, warning icon, light red background), P2 - overdue count badge, and P3 - optional sorting/filtering. The implementation will leverage the existing React frontend and Express.js backend, adding client-side date comparison logic that recalculates overdue status on user interactions.

## Technical Context

**Language/Version**: JavaScript (Node.js for backend, ES6+ for frontend via React 18)  
**Primary Dependencies**: React 18.2, React DOM 18.2, Express.js 4.18, Axios 1.6, better-sqlite3 11.10  
**Storage**: SQLite (via better-sqlite3) for todo persistence  
**Testing**: Jest 29.7 (backend), React Testing Library (frontend via react-scripts 5.0.1)  
**Target Platform**: Web application (browser-based frontend, Node.js backend server)  
**Project Type**: Web (monorepo with packages/frontend and packages/backend)  
**Performance Goals**: <3 seconds for overdue identification (per SC-001), instant UI updates on user interaction  
**Constraints**: Client-side date calculations only, no real-time polling, recalculate on user actions  
**Scale/Scope**: Single-user todo application, existing feature set with ~5 components, adding overdue detection logic

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] **Code Quality & Standards**: Feature design follows established naming conventions and code organization patterns
- [ ] **Test-Driven Development**: Test strategy defined with target coverage identified
- [ ] **User-Centered Design**: User experience considerations documented and accessibility requirements addressed  
- [ ] **Maintainability & Documentation**: Single responsibility principle applied, error handling planned
- [ ] **Incremental Development**: Feature broken into independently testable increments

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
