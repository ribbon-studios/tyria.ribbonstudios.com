import { type ComponentPropsWithoutRef, type ElementType, type FC, type ReactNode } from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import * as styles from './SideBarItem.module.css';
import { cn } from '@/utils/cn';
import { Accordion } from '../Accordion';
import { TuiIcon } from '../TuiIcon';

export function SideBarItem<T extends ElementType = 'div'>({
  as,
  label,
  children,
  icon,
  className,
  isOpen,
  onClick,
  append,
  ...props
}: SideBarItem.Props<T>) {
  const Component = as ?? 'div';

  return (
    <Component {...props} className={cn(styles.item, className)}>
      <div className={cn(styles.target, isOpen && styles.open)} onClick={onClick}>
        {icon ? (
          <>
            <TuiIcon icon={icon} size={{ img: 30, icon: 24 }} />
          </>
        ) : (
          <ChevronRight className={cn('transition-transform', isOpen && 'rotate-90')} />
        )}
        <div className="flex-1">{label}</div>
        {append}
      </div>
      {children && <Accordion isOpen={isOpen}>{children}</Accordion>}
    </Component>
  );
}

export namespace SideBarItem {
  export type Props<T extends ElementType> = {
    as?: T;
    label: string;
    onClick?: () => void;
    append?: ReactNode;
  } & (
    | {
        children: ReactNode;
        isOpen: boolean;
        icon?: never;
      }
    | {
        children?: never;
        isOpen?: never;
        icon: LucideIcon | string;
      }
  ) &
    ComponentPropsWithoutRef<T>;
}
