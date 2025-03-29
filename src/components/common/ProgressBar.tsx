import { useMemo, type FC } from 'react';
import * as styles from './ProgressBar.module.css';

export const ProgressBar: FC<ProgressBar.Props> = ({ percentage, current, max, size = 12, buffer = 2 }) => {
  const internalPercentage = useMemo(() => {
    if (percentage) return percentage;
    if (current && max) return (current / max) * 100;

    return 0;
  }, [percentage, current, max]);

  return (
    <div className={styles.progressBar} style={{ minHeight: size }}>
      <div
        className={styles.indicator}
        style={{
          maxWidth: `calc(100% - ${buffer * 2}px)`,
          width: `calc(${internalPercentage}% - ${buffer * 2}px)`,
          inset: buffer,
        }}
      />
    </div>
  );
};

export namespace ProgressBar {
  export type Props = {
    size?: number;
    buffer?: number;
  } & (
    | {
        current?: number;
        max?: number;
        percentage?: never;
      }
    | {
        current?: never;
        max?: never;
        percentage?: number;
      }
  );
}
