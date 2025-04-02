import { useRef, useState, type ComponentProps, type FC, type ReactNode } from 'react';
import * as styles from './TuiTooltip.module.css';
import { cn } from '@/utils/cn';

export const TuiTooltip: FC<TuiLink.Props> = ({ children, tooltip, offset = 4, onMouseOver, onMouseOut, ...props }) => {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <div
      {...props}
      className={cn(styles.container, open && styles.open)}
      onMouseOver={(event) => {
        setOpen(true);
        onMouseOver?.(event);
      }}
      onMouseOut={(event) => {
        setOpen(false);
        onMouseOut?.(event);
      }}
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
  } & ComponentProps<'div'>;
}
