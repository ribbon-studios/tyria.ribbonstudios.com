import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function RibbonAccordion({ open, children }: RibbonAccordion.Props) {
  return <div className={cn('flex flex-col')}>{children}</div>;
}

export namespace RibbonAccordion {
  export type Props = {
    open: boolean;
    children?: ReactNode;
  };
}
