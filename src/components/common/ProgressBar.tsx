import { useMemo, type ComponentProps, type FC } from 'react';
import * as styles from './ProgressBar.module.css';
import { cn } from '@/utils/cn';
import { TuiTooltip } from './TuiTooltip';

export const ProgressBar: FC<ProgressBar.Props> = ({
  current,
  max,
  markers,
  size = 12,
  buffer = 2,
  className,
  ...props
}) => {
  const internalPercentage = useMemo(() => {
    if (current && max) return (current / max) * 100;

    return 0;
  }, [current, max]);

  const internalMarkers = useMemo(() => {
    if (!markers || !max) return [];

    return markers
      .map((marker) =>
        typeof marker === 'number'
          ? {
              value: marker,
              label: marker,
            }
          : marker
      )
      .filter((marker) => marker.value > 0 && marker.value < max)
      .map((marker) => ({
        ...marker,
        percentage: (marker.value / max) * 100,
      }));
  }, [markers, max]);

  return (
    <div {...props} className={cn(styles.progressBar, className)} style={{ minHeight: size }}>
      <div
        className={styles.indicator}
        style={{
          maxWidth: `calc(100% - ${buffer * 2}px)`,
          width: `calc(${internalPercentage}% - ${buffer * 2}px)`,
          inset: buffer,
        }}
      />
      {internalMarkers.map((marker, i) => (
        <TuiTooltip
          key={i}
          className={styles.markerTooltip}
          style={{
            left: `${marker.percentage}%`,
          }}
          tooltip={marker.label}
          align="center"
        >
          <div className={styles.marker} />
        </TuiTooltip>
      ))}
    </div>
  );
};

export namespace ProgressBar {
  export type Props = {
    size?: number;
    buffer?: number;
    markers?: (number | Marker)[];
    current?: number;
    max?: number;
  } & ComponentProps<'div'>;

  export type Marker = {
    value: number;
    label: string | number;
  };
}
