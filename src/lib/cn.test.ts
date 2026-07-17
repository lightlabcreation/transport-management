import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/cn';

describe('cn', () => {
  it('joins static classes', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center');
  });

  it('includes only truthy conditional object values', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });

  it('flattens nested class arrays', () => {
    expect(cn(['flex', ['items-center', { hidden: false }], 'gap-2'])).toBe(
      'flex items-center gap-2',
    );
  });

  it('ignores false, null, and undefined values', () => {
    expect(cn('base', false, null, undefined, 'visible')).toBe('base visible');
  });

  it('retains the final conflicting padding utility', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('retains the final conflicting modifier utility', () => {
    expect(cn('hover:p-2', 'hover:p-4')).toBe('hover:p-4');
  });

  it('allows a caller semantic background utility to override a default', () => {
    expect(cn('bg-background', 'bg-primary')).toBe('bg-primary');
  });

  it('preserves semantic typography size and color utilities together', () => {
    expect(cn('text-heading-lg', 'text-muted-foreground')).toBe(
      'text-heading-lg text-muted-foreground',
    );
  });

  it('retains the final conflicting semantic typography size', () => {
    expect(cn('text-heading-sm', 'text-heading-lg')).toBe('text-heading-lg');
  });

  it('retains the final conflicting standard text color', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('retains the final conflicting semantic foreground color', () => {
    expect(cn('text-muted-foreground', 'text-foreground')).toBe('text-foreground');
  });
});
