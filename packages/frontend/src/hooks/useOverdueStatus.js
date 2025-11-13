import { useMemo } from 'react';
import { calculateOverdueStatus, getOverdueCount } from '../utils/dateUtils';

/**
 * useOverdueStatus Hook
 * Calculates overdue status for todos with memoization for performance
 * Recalculates only when todos array changes
 *
 * @param {Array<Object>} todos - Array of todo objects
 * @returns {Object} Object containing:
 *   - todosWithStatus: todos array with isOverdue property added
 *   - overdueCount: number of overdue todos
 */
export function useOverdueStatus(todos) {
  const todosWithStatus = useMemo(() => {
    return calculateOverdueStatus(todos);
  }, [todos]);

  const overdueCount = useMemo(() => {
    return getOverdueCount(todosWithStatus);
  }, [todosWithStatus]);

  return {
    todosWithStatus,
    overdueCount
  };
}
