import { cn } from '@/utils/cn';
import { type ReactNode } from 'react';
import * as styles from './Card.module.css';
import { TuiSplash } from './TuiSplash';
import { TuiIcon } from './TuiIcon';

export function Card({ className, children, icon, splash, onClick }: Card.Props) {
  if (splash) {
    return (
      <TuiSplash className={cn(styles.card, className)} {...splash} onClick={onClick}>
        {icon && <TuiIcon icon={icon} size={64} />}
        {children}
      </TuiSplash>
    );
  }

  return (
    <div className={cn(styles.card, className)} onClick={onClick}>
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
    onClick?: () => void;
  };
}
