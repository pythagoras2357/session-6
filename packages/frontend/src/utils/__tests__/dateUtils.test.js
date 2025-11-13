import { isOverdue, calculateOverdueStatus, getOverdueCount } from '../dateUtils';

describe('dateUtils - isOverdue', () => {
  // Helper to create a date string in YYYY-MM-DD format
  const getDateString = (daysOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  };

  const yesterday = getDateString(-1);
  const today = getDateString(0);
  const tomorrow = getDateString(1);

  test('should return false for completed todos, regardless of due date', () => {
    expect(isOverdue(yesterday, true)).toBe(false);
    expect(isOverdue(today, true)).toBe(false);
    expect(isOverdue(tomorrow, true)).toBe(false);
  });

  test('should return true for incomplete todos with past due dates', () => {
    expect(isOverdue(yesterday, false)).toBe(true);
  });

  test('should return false for incomplete todos with today\'s due date', () => {
    expect(isOverdue(today, false)).toBe(false);
  });

  test('should return false for incomplete todos with future due dates', () => {
    expect(isOverdue(tomorrow, false)).toBe(false);
  });

  test('should return false when due date is missing or null', () => {
    expect(isOverdue(null, false)).toBe(false);
    expect(isOverdue(undefined, false)).toBe(false);
    expect(isOverdue('', false)).toBe(false);
  });

  test('should return false for incomplete todos without due dates', () => {
    expect(isOverdue(null, false)).toBe(false);
  });

  test('should handle Date objects as well as date strings', () => {
    const yesterdayDate = new Date(yesterday);
    const todayDate = new Date(today);

    expect(isOverdue(yesterdayDate, false)).toBe(true);
    expect(isOverdue(todayDate, false)).toBe(false);
  });

  test('should ignore time component and compare dates only', () => {
    // Test that times at end of day yesterday are still overdue
    const yesterdayEndOfDay = new Date(yesterday);
    yesterdayEndOfDay.setHours(23, 59, 59, 999);

    expect(isOverdue(yesterdayEndOfDay, false)).toBe(true);
  });

  test('should handle edge case of midnight boundary', () => {
    // A todo due "today" at any time should NOT be overdue
    const todayAtMidnight = new Date(today);
    todayAtMidnight.setHours(0, 0, 0, 0);

    expect(isOverdue(todayAtMidnight, false)).toBe(false);
  });

  test('should handle multiple days in past', () => {
    const twoDaysAgo = getDateString(-2);
    const threeDaysAgo = getDateString(-3);

    expect(isOverdue(twoDaysAgo, false)).toBe(true);
    expect(isOverdue(threeDaysAgo, false)).toBe(true);
  });

  test('should handle multiple days in future', () => {
    const twoDaysLater = getDateString(2);
    const oneWeekLater = getDateString(7);

    expect(isOverdue(twoDaysLater, false)).toBe(false);
    expect(isOverdue(oneWeekLater, false)).toBe(false);
  });
});

describe('dateUtils - calculateOverdueStatus', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  test('should add isOverdue property to each todo', () => {
    const todos = [
      { id: '1', title: 'Task 1', dueDate: yesterdayStr, completed: false },
      { id: '2', title: 'Task 2', dueDate: tomorrowStr, completed: false }
    ];

    const result = calculateOverdueStatus(todos);

    expect(result[0]).toHaveProperty('isOverdue');
    expect(result[1]).toHaveProperty('isOverdue');
  });

  test('should correctly calculate overdue status for each todo', () => {
    const todos = [
      { id: '1', title: 'Overdue task', dueDate: yesterdayStr, completed: false },
      { id: '2', title: 'Current task', dueDate: null, completed: false },
      { id: '3', title: 'Future task', dueDate: tomorrowStr, completed: false },
      { id: '4', title: 'Completed overdue', dueDate: yesterdayStr, completed: true }
    ];

    const result = calculateOverdueStatus(todos);

    expect(result[0].isOverdue).toBe(true);
    expect(result[1].isOverdue).toBe(false);
    expect(result[2].isOverdue).toBe(false);
    expect(result[3].isOverdue).toBe(false);
  });

  test('should not mutate original todos array', () => {
    const todos = [
      { id: '1', title: 'Task', dueDate: yesterdayStr, completed: false }
    ];

    const original = JSON.stringify(todos);
    calculateOverdueStatus(todos);

    expect(JSON.stringify(todos)).toBe(original);
  });

  test('should handle empty array', () => {
    const result = calculateOverdueStatus([]);
    expect(result).toEqual([]);
  });

  test('should handle non-array input', () => {
    expect(calculateOverdueStatus(null)).toEqual([]);
    expect(calculateOverdueStatus(undefined)).toEqual([]);
    expect(calculateOverdueStatus({})).toEqual([]);
  });

  test('should preserve all existing todo properties', () => {
    const todos = [
      {
        id: '1',
        title: 'Task',
        dueDate: yesterdayStr,
        completed: false,
        description: 'Test task',
        createdAt: '2025-01-01'
      }
    ];

    const result = calculateOverdueStatus(todos);

    expect(result[0]).toHaveProperty('id', '1');
    expect(result[0]).toHaveProperty('title', 'Task');
    expect(result[0]).toHaveProperty('description', 'Test task');
    expect(result[0]).toHaveProperty('createdAt', '2025-01-01');
  });
});

describe('dateUtils - getOverdueCount', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  test('should return correct count of overdue todos', () => {
    const todos = [
      { id: '1', title: 'Overdue 1', dueDate: yesterdayStr, completed: false, isOverdue: true },
      { id: '2', title: 'Overdue 2', dueDate: yesterdayStr, completed: false, isOverdue: true },
      { id: '3', title: 'Future task', dueDate: tomorrowStr, completed: false, isOverdue: false }
    ];

    expect(getOverdueCount(todos)).toBe(2);
  });

  test('should return 0 when no todos are overdue', () => {
    const todos = [
      { id: '1', title: 'Future task', dueDate: tomorrowStr, completed: false, isOverdue: false },
      { id: '2', title: 'No due date', dueDate: null, completed: false, isOverdue: false }
    ];

    expect(getOverdueCount(todos)).toBe(0);
  });

  test('should return 0 for empty array', () => {
    expect(getOverdueCount([])).toBe(0);
  });

  test('should return 0 for non-array input', () => {
    expect(getOverdueCount(null)).toBe(0);
    expect(getOverdueCount(undefined)).toBe(0);
    expect(getOverdueCount({})).toBe(0);
  });

  test('should handle mixed overdue and non-overdue todos', () => {
    const todos = [
      { id: '1', isOverdue: true },
      { id: '2', isOverdue: false },
      { id: '3', isOverdue: true },
      { id: '4', isOverdue: false },
      { id: '5', isOverdue: true }
    ];

    expect(getOverdueCount(todos)).toBe(3);
  });
});
