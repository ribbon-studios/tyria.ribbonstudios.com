import type { ComponentProps, ElementType, FC, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import * as styles from './Button.module.css';

export function Button<T extends ElementType = 'button'>({
  as,
  className,
  children,
  color = 'dark',
  disabled,
  loading,
  ...props
}: Button.Props<T>) {
  const Component = as ?? 'button';
  return (
    <Component
      {...props}
      className={cn(styles.button, styles[color], loading && styles.loading, className)}
      disabled={disabled || loading}
    >
      <Loader2 className={styles.loader} />
      <div className={styles.content}>{children}</div>
    </Component>
  );
}

export namespace Button {
  export type Props<T extends ElementType> = {
    as?: T;
    className?: string;
    children?: ReactNode;
    color?: 'dark' | 'light';
    disabled?: boolean;
    loading?: boolean;
  } & ComponentProps<T>;
}
