import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it('renders accessible text with neutral styling by default', () => {
    render(<Badge>Pending</Badge>);
    const badge = screen.getByText('Pending');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveClass('bg-muted', 'text-muted-foreground');
  });

  it.each([
    ['primary', 'bg-primary'],
    ['success', 'bg-success'],
    ['warning', 'bg-warning'],
    ['danger', 'bg-danger'],
    ['info', 'bg-info'],
    ['outline', 'border-border'],
  ] as const)('applies the %s variant', (variant, expectedClass) => {
    render(<Badge variant={variant}>{variant}</Badge>);
    expect(screen.getByText(variant)).toHaveClass(expectedClass);
  });

  it('allows className to extend and override default classes', () => {
    render(<Badge className="rounded-md bg-info">Updated</Badge>);
    const badge = screen.getByText('Updated');
    expect(badge).toHaveClass('rounded-md', 'bg-info');
    expect(badge).not.toHaveClass('rounded-full', 'bg-muted');
  });

  it('has no implicit interactive or live-region semantics', () => {
    render(<Badge>Active</Badge>);
    const badge = screen.getByText('Active');
    expect(badge).not.toHaveAttribute('role');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
