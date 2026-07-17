import type { VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import type { badgeVariants } from './badge.variants';

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export type BadgeVariant = NonNullable<BadgeProps['variant']>;
