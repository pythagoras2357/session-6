---
description: "Task list for implementing overdue todo items feature"
---

# Tasks: Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`  
**Prerequisites**: plan.md (✅ complete), spec.md (✅ complete), research.md (✅ complete)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Each user story phase is a complete, independently testable increment.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Implementation Strategy & Story Dependencies

### User Story Independence

All three user stories are **independently testable and deliverable**:

- **US1 (P1 - Visual Styling)**: MVP core feature. Delivers immediate value by visually identifying overdue todos. Can be fully tested and deployed independently.
- **US2 (P2 - Overdue Badge)**: Builds on US1 component structure. Adds convenience feature. Can be tested independently with same test data.
- **US3 (P3 - Sorting)**: Optional enhancement. Can be implemented and tested independently after US1 and/or US2.

### Recommended MVP Scope

**Phase 1 + Phase 2 + Phase 3 (US1 only)** = Minimum viable feature
- Delivers core value (visual identification)
- Ready for user testing and feedback
- P2 and P3 can be added later based on feedback

### Parallel Execution Opportunities

**Within US1 Phase**:
- `[T007] [P] [US1]` and `[T008] [P] [US1]` can run in parallel (separate components)
- `[T009] [P] [US1]` and `[T010] [P] [US1]` can run in parallel (separate test files)

**Within US2 Phase**:
- `[T012] [P] [US2]` and `[T013] [P] [US2]` can run in parallel (separate components)

**Between Stories**:
- US2 can start immediately after US1 completes (no blocking dependencies)
- US3 can start immediately after US1 completes (no blocking dependencies)

---

## Phase 1: Setup & Infrastructure

**Purpose**: Project initialization and utility functions (shared by all user stories)

- [ ] T001 Create `src/utils/dateUtils.js` with `isOverdue(dueDate, completed)` function per research.md specifications
- [ ] T002 Create `src/utils/__tests__/dateUtils.test.js` with comprehensive unit tests for `isOverdue()` including edge cases (today boundary, past dates, future dates, null dates, completed todos)
- [ ] T003 Add overdue styling CSS to `src/styles/theme.css` with `.overdue` class (red text #c62828, light red background #ffe6e6, left border)
- [ ] T004 Create `src/components/WarningIcon.js` simple component that renders warning icon (⚠️ or unicode equivalent) with role and aria-label
- [ ] T005 Update `src/__tests__/App.test.js` to import and verify utility functions are available

---

## Phase 2: Foundational Components (Shared)

**Purpose**: Blocking prerequisites that all user stories depend on

- [ ] T006 Update Todo entity in `packages/backend/src/services/todoService.js` to include `dueDate` field support (if not already present) - verify existing todo objects have dueDate property
- [ ] T007 [P] Create helper function `calculateOverdueStatus(todos)` in `src/utils/dateUtils.js` that returns array of todos with added `isOverdue` boolean property
- [ ] T008 [P] Create `src/hooks/useOverdueStatus.js` custom React hook that:
  - Accepts todos array as input
  - Returns todos array with calculated overdue status
  - Memoizes results for performance (useMemo)
  - Recalculates on todos array change or user interaction

---

## Phase 3: User Story 1 - Visual Identification of Overdue Todos (P1)

**Goal**: Users can immediately see which todos are overdue through distinct visual styling (red text + warning icon + light red background)

**Independent Test Criteria**: 
- Create todos with various due dates (past, today, future)
- Mark one as complete, leave others incomplete
- Load todo list and verify visual styling applied correctly
- Verify acceptance scenarios 1-5 from spec

**Phase 3 Tasks**:

- [ ] T009 [US1] Update `src/components/TodoCard.js` to:
  - Import useOverdueStatus hook
  - Accept todo object with isOverdue property
  - Conditionally apply `.overdue` CSS class when `todo.isOverdue === true`
  - Include WarningIcon component when todo is overdue
  - Example: `<div className={`todo-card ${todo.isOverdue ? 'overdue' : ''}`}>...`

- [ ] T010 [US1] Update `src/components/TodoList.js` to:
  - Import useOverdueStatus hook
  - Calculate overdue status for all todos before rendering
  - Pass todo object with isOverdue property to TodoCard component
  - Trigger recalculation on component mount and when todos array changes

- [ ] T011 [US1] Create `src/components/TodoCard.test.js` test suite covering:
  - Renders with `.overdue` class when todo.isOverdue is true
  - Does NOT render `.overdue` class when todo.isOverdue is false
  - WarningIcon displays when todo is overdue
  - Red text styling applied (can test via className)
  - Does not show overdue styling for completed todos

- [ ] T012 [US1] Create integration test `src/__tests__/TodoList.overdue.test.js` covering:
  - Renders list with mixed overdue/non-overdue todos
  - Only past-due incomplete todos show overdue styling
  - Today's todos do NOT show overdue styling
  - Future todos do NOT show overdue styling
  - Completed todos with past dates do NOT show overdue styling
  - Todos without due dates do NOT show overdue styling

- [ ] T013 [US1] Update `packages/frontend/src/App.js` to integrate TodoList with overdue functionality if not already integrated

---

## Phase 4: User Story 2 - Overdue Count or Badge (P2)

**Goal**: Show a count badge displaying number of overdue todos; hide badge when count is zero

**Independent Test Criteria**:
- Create multiple todos with various due dates and completion statuses
- Verify badge displays correct count
- Verify badge hides when no overdue items exist
- Verify completed todos not included in count

**Phase 4 Tasks**:

- [ ] T014 [P2] Create `src/components/OverdueBadge.js` component that:
  - Accepts `count` prop (integer)
  - Returns null if count is 0 (hides badge)
  - Returns badge with count display if count > 0
  - Apply red styling to badge (background color #ff6b35 from UI guidelines)
  - Include aria-label: `${count} overdue items`
  - Example structure:
    ```javascript
    export function OverdueBadge({ count }) {
      if (count === 0) return null;
      return (
        <span className="overdue-badge" aria-label={`${count} overdue items`}>
          {count}
        </span>
      );
    }
    ```

- [ ] T015 [P2] Update `src/components/TodoList.js` to:
  - Calculate overdueCount from todos with isOverdue === true
  - Render OverdueBadge component above todo list with overdueCount prop
  - Place badge near list header for visibility

- [ ] T016 [P2] Add CSS for badge styling to `src/styles/theme.css`:
  - `.overdue-badge` class with background color #ff6b35, white text, padding, border-radius
  - Display as inline-block element
  - Align to right or near header

- [ ] T017 [P2] Create `src/components/OverdueBadge.test.js` test suite covering:
  - Returns null (no DOM) when count is 0
  - Displays count when count > 0
  - Applies correct aria-label with count
  - Correct styling class applied

- [ ] T018 [P2] Update integration test `src/__tests__/TodoList.overdue.test.js` to add:
  - Badge displays correct count with 3 overdue + 2 non-overdue todos
  - Badge does not display when no overdue todos exist
  - Badge count excludes completed todos with past dates

---

## Phase 5: User Story 3 - Overdue Sorting Option (P3)

**Goal**: Optional sort/filter to show overdue items at top or exclusively

**Independent Test Criteria**:
- Create mixed list of overdue/non-overdue todos
- Enable overdue sort: verify overdue items appear first
- Enable overdue filter: verify only overdue items visible
- Disable sort/filter: verify list returns to original order

**Phase 5 Tasks**:

- [ ] T019 [P3] Create `src/utils/todoSort.js` utility with functions:
  - `sortByOverdue(todos)` - returns todos sorted with overdue items first
  - `filterByOverdue(todos)` - returns only overdue todos
  - Both should preserve original order within categories

- [ ] T020 [P3] Create `src/utils/__tests__/todoSort.test.js` covering all sort/filter scenarios

- [ ] T021 [P3] Create `src/components/TodoListControls.js` component with:
  - Radio buttons or dropdown: "All", "Overdue Only", "Sort by Overdue"
  - Emit onChange event with selected sort mode
  - Include accessible labels

- [ ] T022 [P3] Update `src/components/TodoList.js` to:
  - Import TodoListControls component
  - Add state for selected sort mode
  - Apply sort/filter based on user selection
  - Render sorted/filtered todos

- [ ] T023 [P3] Add CSS for controls to `src/styles/theme.css`

- [ ] T024 [P3] Create `src/components/TodoListControls.test.js` test suite

- [ ] T025 [P3] Create integration test `src/__tests__/TodoList.sorting.test.js` covering:
  - Sort mode displays overdue items at top
  - Filter mode displays only overdue items
  - Disabling sort/filter returns to default order

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, accessibility, and documentation

- [ ] T026 Verify all ESLint rules pass: `npm run lint:fix` in frontend and backend packages (Constitution Principle I)

- [ ] T027 Verify test coverage meets 80%+ target: `npm test -- --coverage` for frontend

- [ ] T028 Run full test suite: `npm test` to ensure no regressions in existing features

- [ ] T029 Accessibility audit:
  - Verify warning icon has aria-label
  - Verify overdue badge has aria-label
  - Verify color contrast: red #c62828 meets WCAG AA on light backgrounds
  - Test with screen reader (if available)

- [ ] T030 Update component documentation:
  - Add JSDoc comments to TodoCard.js explaining isOverdue prop
  - Add JSDoc to useOverdueStatus hook
  - Add JSDoc to OverdueBadge explaining conditional rendering

- [ ] T031 Create user-facing testing checklist for QA in `/specs/001-overdue-todos/checklists/manual-testing.md`:
  - Create todos with past/present/future dates
  - Verify visual styling for overdue items
  - Verify badge count accuracy
  - Verify sorting behavior (P3)

- [ ] T032 Add feature flag or configuration option to enable/disable overdue feature (if required by project)

- [ ] T033 Performance verification:
  - Verify list with 100+ todos renders in <3 seconds
  - Check for unnecessary re-renders using React DevTools Profiler

- [ ] T034 Update git history: Create final commit with all changes following conventional commit format

---

## Dependency Graph & Critical Path

```
Phase 1 (Setup): T001-T005 (BLOCKING for all stories)
      ↓
Phase 2 (Foundational): T006-T008 (BLOCKING for all stories)
      ↓
Phase 3 (US1 - Visual): T009-T013 ← MVP MINIMUM
      ↓
Phase 4 (US2 - Badge): T014-T018 (optional, depends on US1)
      ↓
Phase 5 (US3 - Sorting): T019-T025 (optional, depends on US1)
      ↓
Phase 6 (Polish): T026-T034 (final validation)
```

**Critical Path for MVP**: T001 → T002 → T003 → T004 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 = **13 tasks**

---

## Parallel Execution Examples

### Example 1: Parallel US1 Component Development
```
Developer A: T007 (calculate overdue function)
Developer B: T009 (TodoCard styling)
Developer C: T010 (TodoList integration)
→ All run in parallel, meet in integration test T012
```

### Example 2: Parallel US1 + US2 Development  
```
Sprint 1 (US1):
  T001-T005 → T006-T008 → T009, T010 (parallel)
  
Sprint 2 (US1 + US2 parallel):
  T011, T012 → T013 (finish US1)
  Meanwhile: T014, T015 (parallel start US2)
  
Sprint 3:
  T016-T018 (complete US2)
```

### Example 3: MVP Delivery
```
Minimal scope to deliver value:
  Phase 1: T001-T005 (no user-facing changes)
  Phase 2: T006-T008 (no user-facing changes)
  Phase 3: T009-T013 (complete, demo overdue visual identification)
  
Result: Users can see overdue todos immediately (US1 complete)
```

---

## Success Metrics & Definition of Done

### Per User Story

**US1 Complete** when:
- [ ] T009-T012 all pass (components built, tests pass)
- [ ] Red text + warning icon + light red background visible on overdue todos
- [ ] No overdue styling on: completed todos, today's todos, future todos, todos without dates
- [ ] Meets SC-001: Users identify all overdue in <3 seconds
- [ ] Meets SC-002: 95% identify overdue correctly (manual testing)

**US2 Complete** when:
- [ ] T014-T018 all pass
- [ ] Badge displays correct count
- [ ] Badge hidden when count is 0
- [ ] Completed todos excluded from count

**US3 Complete** when:
- [ ] T019-T025 all pass
- [ ] Overdue items appear at top when sorted
- [ ] Only overdue items show when filtered
- [ ] Can return to normal view

### Overall Feature Complete when:
- [ ] All 34 tasks complete
- [ ] 80%+ test coverage (Phase 2: Constitution Principle II)
- [ ] Zero ESLint errors (Phase 2: Constitution Principle I)
- [ ] All acceptance scenarios pass (Phase 3+)
- [ ] Zero false positives/negatives in testing (SC-005)
- [ ] Ready for PR review and merge

---

## Testing Summary

- **Unit Tests**: T002, T008, T011, T017, T020, T024 (6 task sets)
- **Integration Tests**: T012, T018, T025 (3 task sets)
- **Manual Testing**: T031 (checklist)
- **Accessibility Testing**: T029 (audit)
- **Performance Testing**: T033 (verification)

**Total Test Coverage**: All 9 functional requirements + 5 success criteria + 5 acceptance scenarios covered by tests
