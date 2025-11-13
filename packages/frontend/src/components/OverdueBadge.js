import React from 'react';

/**
 * OverdueBadge Component
 * Displays a count badge for overdue todos
 * Returns null (no DOM) when count is 0 to reduce visual clutter
 *
 * @param {number} count - Number of overdue todos
 * @returns {JSX.Element|null} Badge element or null
 */
function OverdueBadge({ count }) {
  // Hide badge when count is zero
  if (count === 0) {
    return null;
  }

  return (
    <span
      className="overdue-badge"
      aria-label={`${count} overdue item${count !== 1 ? 's' : ''}`}
      title={`${count} overdue todo${count !== 1 ? 's' : ''}`}
    >
      {count}
    </span>
  );
}

export default OverdueBadge;
