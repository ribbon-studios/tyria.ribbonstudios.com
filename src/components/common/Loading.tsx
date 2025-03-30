import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';
import { type FC, type ReactNode } from 'react';
import * as styles from './Loading.module.css';

export const Loading: FC<Loading.Props> = ({ loading, children, className, contentClassName, ...props }) => {
  if (children) {
    return (
      <div {...props} className={cn(styles.loadingContainer, loading && styles.loading, className)}>
        <Loader2 className={styles.spinner} size={40} />
        <div className={cn(styles.content, contentClassName)}>{children}</div>
      </div>
    );
  }

  return <Loader2 className={cn(styles.spinner, loading && styles.loading, className)} size={40} />;
};

export namespace Loading {
  export type Props = {
    loading: boolean;
    children?: ReactNode;
    className?: string;
    contentClassName?: string;
  };
}
