import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/lib/cn';

export type InputProps = ComponentPropsWithRef<'input'>;

export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        'min-h-control w-full rounded-md border border-input bg-surface px-3 py-2',
        'text-body text-foreground placeholder:text-muted-foreground',
        'transition-colors duration-fast ease-standard',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-muted',
        'read-only:bg-surface-muted aria-invalid:border-danger',
        className,
      )}
      {...props}
    />
  );
}
