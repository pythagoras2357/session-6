import React from 'react';
import TodoCard from './TodoCard';
import OverdueBadge from './OverdueBadge';
import { useOverdueStatus } from '../hooks/useOverdueStatus';

function TodoList({ todos, onToggle, onEdit, onDelete, isLoading }) {
  const { todosWithStatus, overdueCount } = useOverdueStatus(todos);

  if (todos.length === 0) {
    return (
      <div className="todo-list empty-state">
        <p className="empty-state-message">
          No todos yet. Add one to get started! 👻
        </p>
      </div>
    );
  }

  return (
    <div>
      {overdueCount > 0 && (
        <div className="todo-list-header">
          <OverdueBadge count={overdueCount} />
        </div>
      )}
      <div className="todo-list">
        {todosWithStatus.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}


export default TodoList;
