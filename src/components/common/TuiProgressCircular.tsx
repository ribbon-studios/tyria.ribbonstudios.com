import { useEffect, useRef } from 'react';
import * as styles from './TuiProgressCircular.module.css';
import { cn } from '@/utils/cn';

export function TuiProgressCircular({ duration, size = 24, className, loading }: TuiProgressCircular.Props) {
  const progress = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (loading || !progress.current || !duration || duration < 0) return;

    progress.current.animate([{ '--progress': 0 }, { '--progress': 100 }], {
      duration,
      iterations: 1,
    });
  }, [duration, progress, loading]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn(styles.progressCircular, loading && styles.loading, className)}
      style={{
        /* @ts-expect-error */
        '--size': `${size}px`,
      }}
      ref={progress}
    >
      <circle className={styles.background}></circle>
      <circle className={styles.progress}></circle>
    </svg>
  );
}

export namespace TuiProgressCircular {
  export type Props = {
    className?: string;
    size?: number;
    duration?: number;
    loading?: boolean;
  };
}
