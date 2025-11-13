import React from 'react';
import { render, screen } from '@testing-library/react';
import OverdueBadge from '../OverdueBadge';

describe('OverdueBadge Component', () => {
  test('should render nothing (null) when count is 0', () => {
    const { container } = render(<OverdueBadge count={0} />);
    expect(container.firstChild).toBeNull();
  });

  test('should render badge when count is greater than 0', () => {
    render(<OverdueBadge count={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('should display correct count in badge', () => {
    render(<OverdueBadge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('should have correct CSS class', () => {
    render(<OverdueBadge count={3} />);
    const badge = screen.getByText('3');
    expect(badge).toHaveClass('overdue-badge');
  });

  test('should have correct aria-label for single item', () => {
    render(<OverdueBadge count={1} />);
    const badge = screen.getByLabelText('1 overdue item');
    expect(badge).toBeInTheDocument();
  });

  test('should have correct aria-label for multiple items', () => {
    render(<OverdueBadge count={3} />);
    const badge = screen.getByLabelText('3 overdue items');
    expect(badge).toBeInTheDocument();
  });

  test('should have title attribute', () => {
    render(<OverdueBadge count={2} />);
    const badge = screen.getByText('2');
    expect(badge).toHaveAttribute('title', '2 overdue todos');
  });

  test('should handle large counts', () => {
    render(<OverdueBadge count={99} />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });
});
