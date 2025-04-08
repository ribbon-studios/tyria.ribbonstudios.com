import { cn } from '@/utils/cn';
import { useMemo, type ReactNode } from 'react';
import * as styles from './Card.module.css';
import { TuiSplash } from './TuiSplash';
import { TuiIcon } from './TuiIcon';

export function Card({ className, contentClassName, children, icon, splash, onClick }: Card.Props) {
  const internalIcon = useMemo(() => {
    if (typeof icon === 'string') return <TuiIcon icon={icon} size={64} />;

    return icon;
  }, [icon]);
  if (splash) {
    return (
      <TuiSplash className={cn(styles.card, className)} {...splash} onClick={onClick}>
        {internalIcon}
        <div className={cn(styles.content, contentClassName)}>{children}</div>
      </TuiSplash>
    );
  }

  return (
    <div className={cn(styles.card, className)} onClick={onClick}>
      {internalIcon}
      <div className={cn(styles.content, contentClassName)}>{children}</div>
    </div>
  );
}

export namespace Card {
  export type Props = {
    className?: string;
    contentClassName?: string;
    children: ReactNode;
    icon?: ReactNode | string;
    splash?: Pick<TuiSplash.Props, 'image' | 'grayscale'>;
    onClick?: () => void;
  };
}
