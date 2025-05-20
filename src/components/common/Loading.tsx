import { cn } from '@/utils/cn';
import { type ReactNode } from 'react';
import * as styles from './Loading.module.css';
import { Spinner } from './Spinner';
import { useDelayedLoading } from '@/hooks/use-delayed';

export function Loading({
  direction = 'vertical',
  loading,
  size = 40,
  children,
  className,
  contentClassName,
  center,
  delay,
  ...props
}: Loading.Props) {
  const internalLoading = useDelayedLoading(loading, delay);

  if (children) {
    return (
      <div
        {...props}
        className={cn(
          styles.loadingContainer,
          styles[direction],
          center && styles.center,
          internalLoading && styles.loading,
          className
        )}
      >
        <Spinner className={styles.spinner} loading={internalLoading} size={size} />
        {!loading && <div className={cn(styles.content, contentClassName)}>{children}</div>}
      </div>
    );
  }

  return <Spinner className={styles.spinner} loading={internalLoading} size={size} />;
}

export namespace Loading {
  export type Props = {
    direction?: 'vertical' | 'horizontal';
    loading: boolean;
    size?: number;
    children?: ReactNode;
    className?: string;
    contentClassName?: string;
    center?: boolean;
    delay?: number;
  };
}
