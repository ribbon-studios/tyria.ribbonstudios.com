import { cn } from '@/utils/cn';
import { type ComponentProps, type FC } from 'react';
import { Link } from 'react-router-dom';
import * as styles from './TuiLink.module.css';

export const TuiLink: FC<TuiLink.Props> = ({ color = 'default', className, overlay, grayscale, ...props }) => {
  return (
    <Link
      {...props}
      className={cn(
        styles.tuiLink,
        overlay && styles.overlay,
        grayscale && styles.grayscale,
        styles[`color__${color}`],
        className
      )}
    />
  );
};

export namespace TuiLink {
  export type Props = {
    color?: 'default' | 'info';
    overlay?: boolean;
    grayscale?: boolean;
  } & ComponentProps<typeof Link>;
}
