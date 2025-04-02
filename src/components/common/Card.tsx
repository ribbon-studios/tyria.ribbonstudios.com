import { cn } from '@/utils/cn';
import { type ReactNode } from 'react';
import * as styles from './Card.module.css';
import { TuiSplash } from './TuiSplash';
import { TuiIcon } from './TuiIcon';

export function Card({ className, children, icon, splash }: Card.Props) {
  if (splash) {
    return (
      <TuiSplash className={cn(styles.card, className)} {...splash}>
        {icon && <TuiIcon icon={icon} size={64} />}
        {children}
      </TuiSplash>
    );
  }

  return (
    <div className={cn(styles.card, className)}>
      {icon && <TuiIcon icon={icon} size={64} />}
      {children}
    </div>
  );
}

export namespace Card {
  export type Props = {
    className?: string;
    children: ReactNode;
    icon?: string;
    splash?: Pick<TuiSplash.Props, 'image' | 'grayscale'>;
  };
}
