import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function RibbonCard({ className, children }: RibbonCard.Props) {
  return (
    <div
      className={cn('flex flex-col items-center gap-2 bg-tui-dark p-5 border-1 rounded-xl border-tui-gray', className)}
    >
      {children}
    </div>
  );
}

export namespace RibbonCard {
  export type Props = {
    className?: string;
    children: ReactNode;
  };
}
