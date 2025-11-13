/**
 * Date utilities for overdue todo detection
 * Provides functions to determine if a todo is overdue based on due date and completion status
 */

/**
 * Determines if a todo is overdue
 * A todo is overdue if:
 * - It has a due date in the past
 * - It is NOT completed
 * Uses date-only comparison (no time component)
 *
 * @param {string|Date} dueDate - ISO date string or Date object (e.g., "2025-11-10")
 * @param {boolean} completed - Whether the todo is completed
 * @returns {boolean} true if todo is overdue, false otherwise
 */
export function isOverdue(dueDate, completed) {
  // Completed todos cannot be overdue
  if (completed) {
    return false;
  }

  // Todos without due dates cannot be overdue
  if (!dueDate) {
    return false;
  }

  // Normalize today to midnight for date-only comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Normalize due date to midnight for date-only comparison
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  // Compare: overdue if due date is before today
  return due < today;
}

/**
 * Calculates overdue status for an array of todos
 * Adds an `isOverdue` boolean property to each todo object
 *
 * @param {Array<Object>} todos - Array of todo objects, each with dueDate and completed properties
 * @returns {Array<Object>} Array of todos with added `isOverdue` property
 */
export function calculateOverdueStatus(todos) {
  if (!Array.isArray(todos)) {
    return [];
  }

  return todos.map(todo => ({
    ...todo,
    isOverdue: isOverdue(todo.dueDate, todo.completed)
  }));
}

/**
 * Counts the number of overdue todos
 *
 * @param {Array<Object>} todos - Array of todo objects with isOverdue property
 * @returns {number} Count of overdue todos
 */
export function getOverdueCount(todos) {
  if (!Array.isArray(todos)) {
    return 0;
  }

  return todos.filter(todo => todo.isOverdue).length;
}
