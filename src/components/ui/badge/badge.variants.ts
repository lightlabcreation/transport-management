import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-body-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-muted text-muted-foreground',
        primary: 'bg-primary text-primary-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        danger: 'bg-danger text-danger-foreground',
        info: 'bg-info text-info-foreground',
        outline: 'border border-border bg-transparent text-foreground',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);
