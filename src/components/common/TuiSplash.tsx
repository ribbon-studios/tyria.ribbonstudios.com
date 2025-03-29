import { type FC } from 'react';
import * as styles from './TuiSplash.module.css';
import { TuiIcon } from './TuiIcon';
import { cn } from '@/utils/cn';

export const TuiSplash: FC<TuiSplash.Props> = ({ className, grayscale, ...props }) => {
  return <TuiIcon {...props} className={cn(styles.splash, grayscale && styles.grayscale, className)} />;
};

export namespace TuiSplash {
  export type Props = {
    className?: string;
    icon: string;
    grayscale?: boolean;
    size?: number | TuiIcon.Sizes;
  };
}
