import { cn } from '@/utils/cn';
import { useEffect, useState, type FC, type ReactNode } from 'react';
import * as styles from './Loading.module.css';
import { Spinner } from './Spinner';

export const Loading: FC<Loading.Props> = ({
  direction = 'vertical',
  loading,
  size = 40,
  children,
  className,
  contentClassName,
  center,
  delay,
  ...props
}) => {
  const [internalLoading, setInternalLoading] = useState(loading);

  useEffect(() => {
    if (loading) setInternalLoading(true);
    else if (delay) setTimeout(() => setInternalLoading(false), delay);
    else setInternalLoading(false);
  }, [loading]);

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
};

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
