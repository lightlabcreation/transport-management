import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Label } from './Label';

describe('Label', () => {
  it('renders a native label associated through htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email address</Label>
        <input id="email" />
      </>,
    );

    const label = screen.getByText('Email address');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveAttribute('for', 'email');
    expect(screen.getByLabelText('Email address')).toHaveAttribute('id', 'email');
  });

  it('supports wrapping-label association', () => {
    render(
      <Label>
        Display name
        <input />
      </Label>,
    );
    expect(screen.getByLabelText('Display name')).toBeInTheDocument();
  });

  it('passes through native attributes', () => {
    render(
      <Label id="name-label" title="Legal name">
        Name
      </Label>,
    );
    const label = screen.getByText('Name');
    expect(label).toHaveAttribute('id', 'name-label');
    expect(label).toHaveAttribute('title', 'Legal name');
  });

  it('allows className to extend and override default classes', () => {
    render(<Label className="text-body font-semibold text-danger">Name</Label>);
    const label = screen.getByText('Name');
    expect(label).toHaveClass('text-body', 'font-semibold', 'text-danger');
    expect(label).not.toHaveClass('text-body-sm', 'font-medium', 'text-foreground');
  });

  it('does not generate an id or required indicator', () => {
    render(<Label>Name</Label>);
    const label = screen.getByText('Name');
    expect(label).not.toHaveAttribute('id');
    expect(label).toHaveTextContent('Name');
    expect(label).not.toHaveTextContent('*');
  });
});
