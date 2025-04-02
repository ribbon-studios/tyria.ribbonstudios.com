import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, type FC, type ReactNode } from 'react';
import * as styles from './Loading.module.css';

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
        <Loader2 className={styles.spinner} size={size} />
        {!loading && <div className={cn(styles.content, contentClassName)}>{children}</div>}
      </div>
    );
  }

  return <Loader2 className={cn(styles.spinner, internalLoading && styles.loading, className)} size={size} />;
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
