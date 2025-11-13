import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoList from '../TodoList';

describe('TodoList Integration - Overdue Functionality', () => {
  const getDateString = (daysOffset) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  };

  const yesterday = getDateString(-1);
  const today = getDateString(0);
  const tomorrow = getDateString(1);

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should display overdue styling on past due incomplete todos', () => {
    const todos = [
      { id: 1, title: 'Overdue Task', dueDate: yesterday, completed: 0, isOverdue: true }
    ];

    const { container } = render(
      <TodoList todos={todos} {...mockHandlers} isLoading={false} />
    );

    const overdueCard = container.querySelector('.overdue');
    expect(overdueCard).toBeInTheDocument();
    expect(overdueCard).toHaveTextContent('Overdue Task');
  });

  test('should NOT display overdue styling on today\'s due incomplete todos', () => {
    const todos = [
      { id: 1, title: 'Today\'s Task', dueDate: today, completed: 0, isOverdue: false }
    ];

    const { container } = render(
      <TodoList todos={todos} {...mockHandlers} isLoading={false} />
    );

    const overdueCard = container.querySelector('.overdue');
    expect(overdueCard).not.toBeInTheDocument();
  });

  test('should NOT display overdue styling on future due incomplete todos', () => {
    const todos = [
      { id: 1, title: 'Future Task', dueDate: tomorrow, completed: 0, isOverdue: false }
    ];

    const { container } = render(
      <TodoList todos={todos} {...mockHandlers} isLoading={false} />
    );

    const overdueCard = container.querySelector('.overdue');
    expect(overdueCard).not.toBeInTheDocument();
  });

  test('should NOT display overdue styling on completed todos with past dates', () => {
    const todos = [
      { id: 1, title: 'Completed Past Task', dueDate: yesterday, completed: 1, isOverdue: false }
    ];

    const { container } = render(
      <TodoList todos={todos} {...mockHandlers} isLoading={false} />
    );

    const overdueCard = container.querySelector('.overdue');
    expect(overdueCard).not.toBeInTheDocument();
  });

  test('should NOT display overdue styling on todos without due dates', () => {
    const todos = [
      { id: 1, title: 'No Date Task', dueDate: null, completed: 0, isOverdue: false }
    ];

    const { container } = render(
      <TodoList todos={todos} {...mockHandlers} isLoading={false} />
    );

    const overdueCard = container.querySelector('.overdue');
    expect(overdueCard).not.toBeInTheDocument();
  });

  test('should display overdue badge with correct count', () => {
    const todos = [
      { id: 1, title: 'Overdue 1', dueDate: yesterday, completed: 0, isOverdue: true },
      { id: 2, title: 'Overdue 2', dueDate: yesterday, completed: 0, isOverdue: true },
      { id: 3, title: 'Future', dueDate: tomorrow, completed: 0, isOverdue: false }
    ];

    render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

    const badge = screen.getByLabelText('2 overdue items');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('2');
  });

  test('should NOT display overdue badge when count is 0', () => {
    const todos = [
      { id: 1, title: 'Future', dueDate: tomorrow, completed: 0, isOverdue: false }
    ];

    const { container } = render(
      <TodoList todos={todos} {...mockHandlers} isLoading={false} />
    );

    // Badge should not be rendered at all (returns null)
    expect(container.querySelector('.overdue-badge')).not.toBeInTheDocument();
  });

  test('should not include completed todos with past dates in overdue count', () => {
    const todos = [
      { id: 1, title: 'Overdue Incomplete', dueDate: yesterday, completed: 0, isOverdue: true },
      { id: 2, title: 'Overdue Completed', dueDate: yesterday, completed: 1, isOverdue: false },
      { id: 3, title: 'Future', dueDate: tomorrow, completed: 0, isOverdue: false }
    ];

    render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

    const badge = screen.getByLabelText('1 overdue item');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('1');
  });

  test('should display warning icons for overdue todos', () => {
    const todos = [
      { id: 1, title: 'Overdue Task', dueDate: yesterday, completed: 0, isOverdue: true },
      { id: 2, title: 'Future Task', dueDate: tomorrow, completed: 0, isOverdue: false }
    ];

    render(<TodoList todos={todos} {...mockHandlers} isLoading={false} />);

    const warningIcons = screen.getAllByLabelText('warning');
    // Should have 1 warning icon for the overdue task
    expect(warningIcons).toHaveLength(1);
  });

  test('should handle mixed overdue/non-overdue todos correctly', () => {
    const todos = [
      { id: 1, title: 'Overdue 1', dueDate: yesterday, completed: 0, isOverdue: true },
      { id: 2, title: 'Today', dueDate: today, completed: 0, isOverdue: false },
      { id: 3, title: 'Future', dueDate: tomorrow, completed: 0, isOverdue: false },
      { id: 4, title: 'Overdue 2', dueDate: yesterday, completed: 0, isOverdue: true },
      { id: 5, title: 'No Date', dueDate: null, completed: 0, isOverdue: false }
    ];

    const { container } = render(
      <TodoList todos={todos} {...mockHandlers} isLoading={false} />
    );

    // Should have 2 overdue cards
    const overdueCards = container.querySelectorAll('.overdue');
    expect(overdueCards).toHaveLength(2);

    // Should have badge showing 2
    const badge = screen.getByLabelText('2 overdue items');
    expect(badge).toBeInTheDocument();
  });

  test('should display empty state when no todos', () => {
    render(<TodoList todos={[]} {...mockHandlers} isLoading={false} />);

    expect(screen.getByText(/No todos yet/)).toBeInTheDocument();
  });
});
