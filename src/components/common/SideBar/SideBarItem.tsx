import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import * as styles from './SideBarItem.module.css';
import { cn } from '@/utils/cn';
import { Accordion } from '../Accordion';
import { TuiIcon } from '../TuiIcon';
import { TuiTooltip } from '../TuiTooltip';

export function SideBarItem<T extends ElementType = 'div'>({
  as,
  label,
  children,
  icon,
  className,
  isOpen,
  onClick,
  append,
  tooltip,
  ...props
}: SideBarItem.Props<T>) {
  const Component = as ?? 'div';

  const toggle = (
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
  );

  return (
    <Component {...props} className={cn(styles.item, className)}>
      {tooltip ? (
        <TuiTooltip tooltip={tooltip} position="bottom" align="full" noHover>
          {toggle}
        </TuiTooltip>
      ) : (
        toggle
      )}
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
    tooltip?: string;
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
