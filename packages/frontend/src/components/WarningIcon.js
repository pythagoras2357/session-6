import React from 'react';

/**
 * WarningIcon Component
 * Displays a warning icon for overdue todos
 * Uses Unicode warning symbol for broad compatibility
 */
function WarningIcon({ className = '' }) {
  return (
    <span
      className={`warning-icon ${className}`}
      role="img"
      aria-label="warning"
      title="This todo is overdue"
      style={{ marginRight: '8px', color: 'currentColor' }}
    >
      ⚠️
    </span>
  );
}

export default WarningIcon;
