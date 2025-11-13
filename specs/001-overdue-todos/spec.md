# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todos`  
**Created**: 2025-11-13  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date. This helps users quickly spot overdue items without having to manually check dates against today's date."

## Clarifications

### Session 2025-11-13

- Q: What specific visual styling should be used for overdue todos? → A: Red text color + warning icon + light red background
- Q: When does a todo due today become overdue (midnight boundary behavior)? → A: A todo due today is NOT overdue until midnight (when date changes to tomorrow)
- Q: How should the system dynamically update overdue status? → A: Update on user action - status recalculates when user views/interacts with list
- Q: Should the overdue badge be displayed when count is zero? → A: Hide badge entirely when count is zero (only show when overdue items exist)

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Visual Identification of Overdue Todos (Priority: P1)

Users view their todo list and immediately see which tasks are overdue through distinct visual styling. This allows them to quickly identify urgent items that need attention without manually comparing dates.

**Why this priority**: This is the core value of the feature - users must be able to instantly recognize overdue items. Without this, the feature provides no value.

**Independent Test**: Can be fully tested by creating todos with past due dates, loading the todo list, and verifying that overdue items are visually distinct from current or future items.

**Acceptance Scenarios**:

1. **Given** a todo with a due date in the past and status incomplete, **When** the user views the todo list, **Then** the todo is displayed with red text color, a warning icon, and a light red background
2. **Given** a todo with a due date of today and status incomplete, **When** the user views the todo list, **Then** the todo is NOT displayed with overdue styling
3. **Given** a todo with a due date in the future and status incomplete, **When** the user views the todo list, **Then** the todo is NOT displayed with overdue styling
4. **Given** a todo with a due date in the past and status complete, **When** the user views the todo list, **Then** the todo is NOT displayed with overdue styling (completed items cannot be overdue)
5. **Given** a todo with no due date, **When** the user views the todo list, **Then** the todo is NOT displayed with overdue styling

---

### User Story 2 - Overdue Count or Badge (Priority: P2)

Users see a count or badge indicating the total number of overdue todos in their list, providing immediate awareness of how many urgent items require attention.

**Why this priority**: While less critical than visual identification, a count/badge provides quick context about workload and urgency at a glance without scanning the entire list.

**Independent Test**: Can be tested by creating multiple todos with various due dates and completion statuses, then verifying the count accurately reflects only incomplete todos with past due dates.

**Acceptance Scenarios**:

1. **Given** 3 incomplete todos with past due dates and 2 incomplete todos with future due dates, **When** the user views the todo list, **Then** an overdue count/badge displays "3"
2. **Given** no incomplete todos with past due dates, **When** the user views the todo list, **Then** no overdue count/badge is displayed
3. **Given** completed todos with past due dates, **When** the user views the todo list, **Then** these completed items are NOT included in the overdue count

---

### User Story 3 - Overdue Sorting Option (Priority: P3)

Users can optionally sort or filter their todo list to show overdue items at the top or exclusively, helping them focus on urgent tasks when needed.

**Why this priority**: This is a convenience feature that enhances usability but is not essential for the core value proposition. Users can still identify overdue items through visual styling even without sorting.

**Independent Test**: Can be tested by creating a mixed list of todos with various due dates, enabling the overdue sort/filter, and verifying that overdue items appear at the top or exclusively.

**Acceptance Scenarios**:

1. **Given** a todo list with mixed due dates, **When** the user enables overdue sorting, **Then** all incomplete todos with past due dates appear at the top of the list
2. **Given** a todo list with mixed due dates, **When** the user enables overdue filtering, **Then** only incomplete todos with past due dates are displayed
3. **Given** overdue sort/filter is enabled, **When** the user disables it, **Then** the list returns to the default sort order

---

### Edge Cases

- A todo with due date of today remains NOT overdue until midnight when the date changes to tomorrow (date-only comparison, no intraday time consideration)
- System uses user's local timezone for date calculations; timezone differences are handled by the browser/system
- If user's system clock is incorrect, overdue calculations reflect the system's current date (garbage in, garbage out)
- When user opens app after being offline, overdue status is calculated fresh based on current date at that moment
- If a todo becomes overdue while user is viewing the list without interaction, it will not update until the next user action (view refresh, interaction); no real-time polling required

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST calculate overdue status by comparing the todo's due date to the current date (date only, not time); a todo due today is NOT overdue until the date changes to tomorrow at midnight
- **FR-002**: System MUST apply overdue status only to incomplete todos with due dates in the past
- **FR-003**: System MUST NOT apply overdue status to completed todos, regardless of their due date
- **FR-004**: System MUST NOT apply overdue status to todos without a due date
- **FR-005**: System MUST display overdue todos with red text color, a warning icon, and a light red background to differentiate them from non-overdue items
- **FR-006**: System MUST recalculate and update overdue status when the user views or interacts with the todo list (e.g., loading the page, completing a todo, adding a new todo)
- **FR-007**: System MUST calculate overdue status based on the user's current date at viewing time
- **FR-008**: System MUST include an overdue count or badge showing the number of overdue incomplete todos
- **FR-009**: System MUST support sorting or filtering todos to prioritize overdue items (optional enhancement, Priority P3)

### Key Entities

- **Todo**: Core entity that includes attributes for title, due date (optional), completion status, and derived overdue status. The overdue status is calculated based on comparing the due date to the current date when the completion status is incomplete.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue todos in under 3 seconds without reading individual dates
- **SC-002**: 95% of users correctly identify which todos are overdue in usability testing
- **SC-003**: Overdue status updates correctly when the date changes (e.g., at midnight)
- **SC-004**: Users report improved task prioritization and awareness of urgent items (measured through user feedback)
- **SC-005**: Zero false positives (todos incorrectly marked as overdue) or false negatives (overdue todos not marked)

## Assumptions

- The system already has a mechanism to display due dates on todo items
- The current date is reliably available from the system or browser
- Users understand the concept of "overdue" as meaning the due date has passed and the task is incomplete
- Visual styling capabilities exist in the UI to differentiate overdue items (e.g., color, icons, badges)
- Default timezone for date calculations is the user's local timezone
- A todo with a due date of "today" is not considered overdue until the date changes to tomorrow

## Out of Scope

- Email or push notifications for overdue todos
- Customizable overdue visual styling by users
- Snooze or reschedule functionality for overdue items
- Historical tracking of how long items have been overdue
- Overdue analytics or reporting features
- Multi-timezone support for teams or shared todos
- Custom business rules for overdue calculations (e.g., excluding weekends)
