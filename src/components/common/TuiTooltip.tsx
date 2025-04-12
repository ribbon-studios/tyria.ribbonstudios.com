import { useEffect, useMemo, useRef, useState, type ComponentProps, type FC, type ReactNode } from 'react';
import * as styles from './TuiTooltip.module.css';
import { cn } from '@/utils/cn';

export const TuiTooltip: FC<TuiTooltip.Props> = ({
  children,
  className,
  tooltip,
  tooltipClassName,
  offset = 4,
  onMouseOver,
  onMouseOut,
  allowLocking,
  position = 'bottom',
  align = 'start',
  preventNesting,
  noHover,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [isLocked, setLocked] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dynamicStyles = useMemo<React.CSSProperties>(() => {
    switch (position) {
      case 'top':
        return { paddingBottom: offset };
      case 'bottom':
        return { paddingTop: offset };
      case 'left':
        return { paddingRight: offset };
      case 'right':
        return { paddingLeft: offset };
    }
  }, [offset, position]);

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
      className={cn(
        styles.container,
        styles[position],
        styles[align],
        open && styles.open,
        isLocked && styles.locked,
        noHover && styles.noHover,
        className
      )}
      onMouseOver={(event) => {
        if (preventNesting) event.stopPropagation();
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
      <div className={cn(styles.tooltip, tooltipClassName)} style={dynamicStyles} ref={tooltipRef}>
        <div className={styles.contents}>{tooltip}</div>
      </div>
    </div>
  );
};

export namespace TuiTooltip {
  export type Props = {
    className?: string;
    tooltipClassName?: string;
    children?: ReactNode;
    tooltip: ReactNode;
    offset?: number;
    allowLocking?: boolean;
    position?: 'left' | 'right' | 'top' | 'bottom';
    align?: 'start' | 'center' | 'end' | 'full';
    preventNesting?: boolean;
    noHover?: boolean;
  } & ComponentProps<'div'>;
}
