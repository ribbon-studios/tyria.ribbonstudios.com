import { useEffect, useRef, useState, type ComponentProps, type FC, type ReactNode } from 'react';
import * as styles from './TuiTooltip.module.css';
import { cn } from '@/utils/cn';

export const TuiTooltip: FC<TuiLink.Props> = ({
  children,
  tooltip,
  offset = 4,
  onMouseOver,
  onMouseOut,
  allowLocking,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [isLocked, setLocked] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLocked) return;

    const listener = (event: Event) => {
      const path = event.composedPath();

      if (tooltipRef.current && path.includes(tooltipRef.current)) return;

      setLocked(false);

      if (containerRef.current && !path.includes(containerRef.current)) {
        setOpen(false);
      }
    };

    document.body.addEventListener('click', listener);

    return () => {
      document.body.removeEventListener('click', listener);
    };
  }, [isLocked]);

  return (
    <div
      {...props}
      className={cn(styles.container, open && styles.open, isLocked && styles.locked)}
      onMouseOver={(event) => {
        setOpen(true);
        onMouseOver?.(event);
      }}
      onClick={(event) => {
        if (
          !allowLocking ||
          isLocked ||
          !tooltipRef.current ||
          event.nativeEvent.composedPath().includes(tooltipRef.current)
        )
          return;

        event.stopPropagation();
        setLocked(true);
      }}
      onMouseOut={(event) => {
        if (isLocked) return;

        setOpen(false);
        onMouseOut?.(event);
      }}
      ref={containerRef}
    >
      {children}
      <div className={styles.tooltip} style={{ paddingTop: offset }} ref={tooltipRef}>
        <div className={styles.contents}>{tooltip}</div>
      </div>
    </div>
  );
};

export namespace TuiLink {
  export type Props = {
    children: ReactNode;
    tooltip: ReactNode;
    offset?: number;
    allowLocking?: boolean;
  } & ComponentProps<'div'>;
}
