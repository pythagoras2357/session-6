# Research: Overdue Todo Items

**Feature**: 001-overdue-todos  
**Date**: 2025-11-13  
**Status**: Complete

## Overview

Research findings for implementing overdue todo detection in the existing React/Express todo application. Focus areas: date comparison strategies, visual styling approaches, and performance considerations for client-side calculations.

## Date Comparison Strategy

### Decision: Client-side date-only comparison using JavaScript Date objects

**Rationale**:
- Spec requires "date only, not time" comparison (FR-001)
- Calculation happens on user interaction, not server-side
- Browser's native Date object provides reliable local timezone support
- Simpler implementation: no server-side changes needed for date logic

**Implementation approach**:
```javascript
function isOverdue(dueDate, completed) {
  if (completed || !dueDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0); // Normalize to midnight
  
  return due < today;
}
```

**Alternatives considered**:
- Server-side calculation: Rejected - requires API changes, adds latency, spec indicates client-side recalculation
- Date libraries (moment.js, date-fns): Rejected - overkill for simple date comparison, adds bundle size
- String comparison: Rejected - error-prone with timezone edge cases

## Visual Styling Implementation

### Decision: CSS classes with conditional rendering based on overdue status

**Rationale**:
- Clarification specified: red text + warning icon + light red background
- Aligns with existing UI guidelines (Halloween theme with orange/red colors)
- CSS classes enable easy testing and maintainability
- Conditional className in React is idiomatic pattern

**Implementation approach**:
```css
.todo-card.overdue {
  background-color: #ffe6e6; /* Light red background */
  color: #c62828; /* Red text from ui-guidelines.md */
  border-left: 4px solid #c62828;
}

.todo-card.overdue .warning-icon {
  display: inline-block;
  color: #c62828;
}
```

**Icon choice**: Use Unicode warning symbol (⚠️) or existing icon set if available in the project

**Alternatives considered**:
- Inline styles: Rejected - harder to test, less maintainable
- Different color schemes: Rejected - clarification specified red, UI guidelines confirm red for danger/alerts
- Animation: Rejected - spec requests simplicity, no motion mentioned

## Overdue Count Badge

### Decision: Conditional rendering of badge component when count > 0

**Rationale**:
- Clarification confirmed: hide badge when count is zero
- Follows common UI pattern (badges indicate items needing attention)
- Reduces visual clutter when no action needed

**Implementation approach**:
```javascript
function OverdueBadge({ count }) {
  if (count === 0) return null;
  
  return (
    <span className="overdue-badge" aria-label={`${count} overdue items`}>
      {count}
    </span>
  );
}
```

**Placement**: Near todo list header or app title for visibility

**Alternatives considered**:
- Always show badge with "0": Rejected based on clarification
- Neutral styling for zero: Rejected - cleaner to hide entirely

## Dynamic Update Strategy

### Decision: Recalculate overdue status in component render/effect hooks

**Rationale**:
- Clarification confirmed: update on user action, not polling
- React's rendering lifecycle naturally triggers on state changes
- Simple implementation: derive overdue status during render
- No performance concerns for typical todo list sizes (<1000 items)

**Implementation approach**:
```javascript
function TodoList({ todos }) {
  const todosWithOverdue = todos.map(todo => ({
    ...todo,
    isOverdue: isOverdue(todo.dueDate, todo.completed)
  }));
  
  const overdueCount = todosWithOverdue.filter(t => t.isOverdue).length;
  
  return (
    <>
      <OverdueBadge count={overdueCount} />
      {todosWithOverdue.map(todo => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </>
  );
}
```

**Alternatives considered**:
- setInterval polling: Rejected based on clarification and performance concerns
- Web Workers: Rejected - overkill for simple calculations
- Server-sent events: Rejected - adds complexity, not required by spec

## Sorting/Filtering (Priority P3)

### Decision: Array sort with overdue status as primary key

**Rationale**:
- Optional feature, implement after P1 and P2
- Standard JavaScript array methods sufficient
- Can be toggled by user via UI control

**Implementation approach**:
```javascript
function sortTodos(todos, sortBy) {
  if (sortBy === 'overdue') {
    return [...todos].sort((a, b) => {
      const aOverdue = isOverdue(a.dueDate, a.completed);
      const bOverdue = isOverdue(b.dueDate, b.completed);
      if (aOverdue === bOverdue) return 0;
      return aOverdue ? -1 : 1; // Overdue items first
    });
  }
  return todos; // Default sorting
}
```

**Alternatives considered**:
- Backend sorting: Rejected - client-side is sufficient and more responsive
- Separate filtered view: Optional enhancement, implement toggle for both sort and filter

## Accessibility Considerations

### Decision: ARIA labels and semantic HTML for overdue indicators

**Rationale**:
- Constitution Principle III requires WCAG AA compliance
- Screen readers must announce overdue status
- Visual indicators alone insufficient

**Implementation**:
- Add `aria-label` to overdue badge: "X overdue items"
- Use semantic warning icon with `role="img"` and `aria-label="warning"`
- Ensure color contrast meets WCAG AA (red #c62828 on light backgrounds passes)

## Testing Strategy

### Unit Tests:
- `isOverdue()` function with various date scenarios
- Overdue badge rendering (show/hide logic)
- TodoCard with overdue styling application

### Integration Tests:
- Todo list with mixed overdue/non-overdue items
- Overdue count accuracy
- Sorting/filtering behavior (P3)

### Coverage Target:
- 80%+ overall (per constitution)
- 100% for overdue calculation logic (critical path)

## Dependencies Required

**No new dependencies needed**:
- Date manipulation: Native JavaScript Date object
- Styling: Existing CSS infrastructure
- Icons: Unicode or existing icon library
- Testing: Existing Jest + React Testing Library setup

## Performance Considerations

**Expected Performance**:
- Date comparison: O(1) per todo
- List rendering: O(n) where n = number of todos
- For 100 todos: <1ms calculation time
- Meets SC-001 requirement: <3 seconds identification (well under)

**Optimization notes**:
- No optimization needed for typical use (<1000 todos)
- If performance issues arise, consider memoization with `useMemo`

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Timezone confusion | Medium | Document assumption of local timezone, use normalized dates |
| Midnight boundary edge cases | High | Comprehensive unit tests for date boundaries |
| Performance with large lists | Low | Use React.memo and useMemo if needed |
| Accessibility compliance | Medium | Implement ARIA labels from start, test with screen readers |

## Next Steps

1. Phase 1: Create data-model.md (extend Todo entity with overdue field)
2. Phase 1: Define API contracts (if any backend changes needed)
3. Phase 1: Write quickstart.md for development setup
4. Phase 2: Generate tasks.md breaking down implementation by user story
