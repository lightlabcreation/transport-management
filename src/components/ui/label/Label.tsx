import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/lib/cn';

export type LabelProps = ComponentPropsWithRef<'label'>;

export function Label({ className, ref, ...props }: LabelProps) {
  return (
    <label
      ref={ref}
      className={cn('text-body-sm font-medium text-foreground', className)}
      {...props}
    />
  );
}
