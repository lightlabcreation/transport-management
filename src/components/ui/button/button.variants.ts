import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
    'font-semibold transition-colors duration-fast ease-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
        outline:
          'border border-border bg-surface text-foreground hover:bg-surface-muted active:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted active:bg-accent',
        danger: 'bg-danger text-danger-foreground hover:bg-danger/90 active:bg-danger/80',
      },
      size: {
        sm: 'min-h-10 px-3 text-body-sm',
        md: 'min-h-control px-4 text-body',
        lg: 'min-h-12 px-6 text-body-lg',
        icon: 'size-control shrink-0 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);
