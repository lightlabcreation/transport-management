import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders a native button with an accessible name and safe default type', () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('bg-primary', 'min-h-control');
  });

  it('supports native button attributes', () => {
    render(
      <Button type="submit" name="intent" value="save">
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('name', 'intent');
    expect(button).toHaveAttribute('value', 'save');
  });

  it.each([
    ['secondary', 'bg-secondary'],
    ['outline', 'border-border'],
    ['ghost', 'bg-transparent'],
    ['danger', 'bg-danger'],
  ] as const)('applies the %s variant', (variant, expectedClass) => {
    render(<Button variant={variant}>{variant}</Button>);
    expect(screen.getByRole('button', { name: variant })).toHaveClass(expectedClass);
  });

  it.each([
    ['sm', 'min-h-10'],
    ['lg', 'min-h-12'],
    ['icon', 'size-control'],
  ] as const)('applies the %s size', (size, expectedClass) => {
    render(
      <Button size={size} aria-label={size}>
        {size}
      </Button>,
    );
    expect(screen.getByRole('button', { name: size })).toHaveClass(expectedClass);
  });

  it('supports full-width layout', () => {
    render(<Button fullWidth>Continue</Button>);
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveClass('w-full');
  });

  it('allows className to extend and override default classes', () => {
    render(<Button className="rounded-lg bg-info">Details</Button>);
    expect(screen.getByRole('button', { name: 'Details' })).toHaveClass('rounded-lg', 'bg-info');
    expect(screen.getByRole('button', { name: 'Details' })).not.toHaveClass('bg-primary');
  });

  it('prevents interaction when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is busy, disabled, non-interactive, and keeps its name while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('uses native keyboard activation', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Continue</Button>);

    screen.getByRole('button', { name: 'Continue' }).focus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });
});
