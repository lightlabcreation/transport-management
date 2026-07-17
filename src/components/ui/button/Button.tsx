import { cn } from '@/lib/cn';

import type { ButtonProps } from './button.types';
import { buttonVariants } from './button.variants';

export function Button({
  className,
  variant,
  size,
  fullWidth,
  isLoading = false,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    />
  );
}
