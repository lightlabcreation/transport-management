import { cn } from '@/lib/cn';

import type { BadgeProps } from './badge.types';
import { badgeVariants } from './badge.variants';

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
