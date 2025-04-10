import { useMemo, type ComponentProps, type ElementType, type FC, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import * as styles from './TuiButton.module.css';
import { useDelayedLoading } from '@/hooks/use-delayed';

export function TuiButton<T extends ElementType = 'button'>({
  as,
  className,
  children,
  color = 'tui-dark',
  disabled,
  loading,
  delay,
  ...props
}: TuiButton.Props<T>) {
  const Component = as ?? 'button';

  const internalLoading = useDelayedLoading(loading, delay);

  const dynamicStyles = useMemo(() => {
    const colors = TuiButton.COLORS[color];

    return {
      ...props.styles,
      '--tui-button-background': `var(--color-${color})`,
      '--tui-button-color': colors.color,
      '--tui-button-border': colors.border,
    };
  }, [props.styles, color]);

  return (
    <Component
      {...props}
      className={cn(styles.button, internalLoading && styles.loading, className)}
      style={dynamicStyles}
      disabled={disabled || internalLoading}
    >
      <Loader2 className={styles.loader} />
      <div className={styles.content}>{children}</div>
    </Component>
  );
}

export namespace TuiButton {
  export type Props<T extends ElementType> = {
    as?: T;
    className?: string;
    children?: ReactNode;
    color?: Color;
    disabled?: boolean;
    loading?: boolean;
    delay?: number;
  } & Omit<ComponentProps<T>, 'color'>;

  export type Color = 'tui-gray' | 'tui-light-gray' | 'tui-dark' | 'tui-error' | 'tui-success' | 'tui-warning';
  export type Colors = {
    border: string;
    color: string;
  };

  export const COLORS: Record<Color, Colors> = {
    'tui-dark': {
      border: 'var(--color-tui-gray)',
      color: 'white',
    },
    'tui-gray': {
      border: 'var(--color-tui-light-gray)',
      color: 'white',
    },
    'tui-light-gray': {
      border: 'var(--color-tui-gray)',
      color: 'white',
    },
    'tui-error': {
      border: 'var(--color-tui-gray)',
      color: 'white',
    },
    'tui-success': {
      border: 'var(--color-tui-gray)',
      color: 'white',
    },
    'tui-warning': {
      border: 'var(--color-tui-gray)',
      color: 'var(--color-tui-dark)',
    },
  };
}
