import { cn } from '@/utils/cn';
import { type ComponentProps, type FC } from 'react';
import { Link } from 'react-router-dom';
import * as styles from './TuiLink.module.css';
import type { Color } from '@/types';
import { variable } from '@/utils/css';

export const TuiLink: FC<TuiLink.Props> = ({ color, className, overlay, grayscale, ...props }) => {
  return (
    <Link
      {...props}
      className={cn(styles.tuiLink, overlay && styles.overlay, grayscale && styles.grayscale, className)}
      style={{
        color: variable.tui(color),
      }}
    />
  );
};

export namespace TuiLink {
  export type Props = {
    color?: Color;
    overlay?: boolean;
    grayscale?: boolean;
  } & ComponentProps<typeof Link>;
}
