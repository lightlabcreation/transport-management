import type { VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';

import type { buttonVariants } from './button.variants';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export type ButtonVariant = NonNullable<ButtonProps['variant']>;
export type ButtonSize = NonNullable<ButtonProps['size']>;
