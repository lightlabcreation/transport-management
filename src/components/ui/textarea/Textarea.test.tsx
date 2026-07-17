import { createRef, useState } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Label } from '@/components/ui/label';

import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a native textarea associated with a visible label', () => {
    render(
      <>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Notes' }).tagName).toBe('TEXTAREA');
  });

  it('supports controlled usage', async () => {
    const user = userEvent.setup();

    function ControlledTextarea() {
      const [value, setValue] = useState('');
      return (
        <Textarea
          aria-label="Controlled notes"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      );
    }

    render(<ControlledTextarea />);
    const textarea = screen.getByRole('textbox', { name: 'Controlled notes' });
    await user.type(textarea, 'Trip details');
    expect(textarea).toHaveValue('Trip details');
  });

  it('supports uncontrolled default values', () => {
    render(<Textarea aria-label="Uncontrolled notes" defaultValue="Initial notes" />);
    expect(screen.getByRole('textbox', { name: 'Uncontrolled notes' })).toHaveValue(
      'Initial notes',
    );
  });

  it('passes through native textarea attributes and state', () => {
    render(
      <Textarea
        aria-label="Summary"
        name="summary"
        form="details"
        rows={6}
        maxLength={200}
        required
        disabled
        readOnly
        aria-invalid="true"
        aria-describedby="summary-description summary-error"
        aria-errormessage="summary-error"
      />,
    );

    const textarea = screen.getByRole('textbox', { name: 'Summary' });
    expect(textarea).toHaveAttribute('name', 'summary');
    expect(textarea).toHaveAttribute('form', 'details');
    expect(textarea).toHaveAttribute('rows', '6');
    expect(textarea).toHaveAttribute('maxlength', '200');
    expect(textarea).toBeRequired();
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute('readonly');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-describedby', 'summary-description summary-error');
    expect(textarea).toHaveAttribute('aria-errormessage', 'summary-error');
  });

  it('uses a practical minimum height and vertical resize', () => {
    render(<Textarea aria-label="Resizable" />);
    expect(screen.getByRole('textbox', { name: 'Resizable' })).toHaveClass('min-h-24', 'resize-y');
  });

  it('allows className to extend and override default classes', () => {
    render(<Textarea aria-label="Custom" className="min-h-32 resize-none bg-card" />);
    const textarea = screen.getByRole('textbox', { name: 'Custom' });
    expect(textarea).toHaveClass('min-h-32', 'resize-none', 'bg-card');
    expect(textarea).not.toHaveClass('min-h-24', 'resize-y', 'bg-surface');
  });

  it('exposes the native textarea through a React 19 ref', () => {
    const textareaRef = createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Focusable notes" ref={textareaRef} />);

    textareaRef.current?.focus();
    expect(screen.getByRole('textbox', { name: 'Focusable notes' })).toHaveFocus();
  });
});
