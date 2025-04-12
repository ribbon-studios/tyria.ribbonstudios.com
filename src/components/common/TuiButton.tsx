import { useMemo, type ComponentProps, type ElementType, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import * as styles from './TuiButton.module.css';
import { useDelayedLoading } from '@/hooks/use-delayed';
import type { Color } from '@/types';
import { variable } from '@/utils/css';

export function TuiButton<T extends ElementType = 'button'>({
  as,
  className,
  children,
  color = 'dark',
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
      '--tui-button-background': variable.tui(color),
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

  export type Colors = {
    border: string;
    color: string;
  };

  export const COLORS: Record<Color, Colors> = {
    info: {
      border: variable.tui('gray'),
      color: 'white',
    },
    dark: {
      border: variable.tui('gray'),
      color: 'white',
    },
    gray: {
      border: variable.tui('light-gray'),
      color: 'white',
    },
    'light-gray': {
      border: variable.tui('gray'),
      color: 'white',
    },
    error: {
      border: variable.tui('gray'),
      color: 'white',
    },
    success: {
      border: variable.tui('gray'),
      color: 'white',
    },
    warning: {
      border: variable.tui('gray'),
      color: variable.tui('dark'),
    },
  };
}
