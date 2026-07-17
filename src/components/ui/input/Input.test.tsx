import { createRef, useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Label } from '@/components/ui/label';

import { Input } from './Input';

describe('Input', () => {
  it('renders a native text input associated with a visible label', () => {
    render(
      <>
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input.tagName).toBe('INPUT');
    expect(input).not.toHaveAttribute('type');
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();

    function ControlledInput() {
      const [value, setValue] = useState('');
      return (
        <Input
          aria-label="Controlled"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      );
    }

    render(<ControlledInput />);
    const input = screen.getByRole('textbox', { name: 'Controlled' });
    await user.type(input, 'Priya');
    expect(input).toHaveValue('Priya');
  });

  it('supports uncontrolled default values', () => {
    render(<Input aria-label="Uncontrolled" defaultValue="Kiaan" />);
    expect(screen.getByRole('textbox', { name: 'Uncontrolled' })).toHaveValue('Kiaan');
  });

  it('passes through native input attributes and types', () => {
    render(
      <Input
        aria-label="Quantity"
        type="number"
        name="quantity"
        form="details"
        autoComplete="off"
        inputMode="numeric"
        min={1}
        max={10}
        step={1}
        required
      />,
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('name', 'quantity');
    expect(input).toHaveAttribute('form', 'details');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('inputmode', 'numeric');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '10');
    expect(input).toHaveAttribute('step', '1');
    expect(input).toBeRequired();
  });

  it('preserves disabled, read-only, and ARIA state', () => {
    render(
      <Input
        aria-label="Account"
        disabled
        readOnly
        aria-invalid="true"
        aria-describedby="account-description account-error"
        aria-errormessage="account-error"
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Account' });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'account-description account-error');
    expect(input).toHaveAttribute('aria-errormessage', 'account-error');
  });

  it('allows className to extend and override default classes', () => {
    render(<Input aria-label="Custom" className="min-h-12 rounded-lg bg-card" />);
    const input = screen.getByRole('textbox', { name: 'Custom' });
    expect(input).toHaveClass('min-h-12', 'rounded-lg', 'bg-card');
    expect(input).not.toHaveClass('min-h-control', 'rounded-md', 'bg-surface');
  });

  it('exposes the native input through a React 19 ref', () => {
    const inputRef = createRef<HTMLInputElement>();
    render(<Input aria-label="Focusable" ref={inputRef} />);

    inputRef.current?.focus();
    expect(screen.getByRole('textbox', { name: 'Focusable' })).toHaveFocus();
  });

  it('does not generate an id or message elements', () => {
    const { container } = render(<Input aria-label="Standalone" />);
    expect(screen.getByRole('textbox', { name: 'Standalone' })).not.toHaveAttribute('id');
    expect(container.querySelectorAll('input')).toHaveLength(1);
    expect(container.querySelectorAll('[role="alert"], [role="status"]')).toHaveLength(0);
  });
});
