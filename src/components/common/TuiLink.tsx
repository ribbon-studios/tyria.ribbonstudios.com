import { cn } from '@/utils/cn';
import { type ComponentProps, type FC, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import * as styles from './TuiLink.module.css';

export const TuiLink: FC<TuiLink.Props> = ({ color = 'default', className, ...props }) => {
  return <Link {...props} className={cn(styles.tuiLink, styles[`color__${color}`], className)} />;
};

export namespace TuiLink {
  export type Props = {
    color?: 'default' | 'info';
  } & ComponentProps<typeof Link>;
}
