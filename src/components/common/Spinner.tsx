import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';
import * as styles from './Spinner.module.css';

export function Spinner({ className, loading, size = 40 }: Spinner.Props) {
  return (
    <div className={cn(styles.container, loading && styles.loading, className)}>
      <Loader2 className={styles.spinner} size={size} />
      <Loader2 className={styles.shadow} size={size} />
    </div>
  );
}

export namespace Spinner {
  export type Props = {
    className?: string;
    loading: boolean;
    size?: number;
  };
}
