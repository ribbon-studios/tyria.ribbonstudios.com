'use client';
import { ComponentProps, ElementType, ReactNode, useMemo } from 'react';
import styles from './RibbonButton.module.css';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';
import { variable } from '@/utils/css';
import { Color } from '@/types';
import { useDelayedLoading } from '@/hooks/use-delayed-loading';

export function RibbonButton<T extends ElementType = 'button'>({
  as,
  className,
  children,
  color = 'dark',
  variant = 'default',
  disabled,
  loading,
  delay,
  ...props
}: RibbonButton.Props<T>) {
  const Component = as ?? 'div';

  const internalLoading = useDelayedLoading(loading, delay);

  const dynamicStyles = useMemo(() => {
    const colors = RibbonButton.COLORS[color];

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
      className={cn(styles.button, styles[`variant-${variant}`], internalLoading && styles.loading, className)}
      style={dynamicStyles}
      disabled={disabled || internalLoading}
    >
      <Loader2 className={styles.loader} />
      <div className={styles.content}>{children}</div>
    </Component>
  );
}

export namespace RibbonButton {
  export type Props<T extends ElementType> = {
    as?: T;
    className?: string;
    children?: ReactNode;
    color?: Color;
    variant?: 'outlined' | 'default';
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
