import { type ReactNode } from 'react';
import { TuiCard } from './common/TuiCard';
import { cn } from '@/utils/cn';

export function AppFrame({ header, children, className }: AppFrame.Props) {
  return (
    <TuiCard className={cn('flex flex-col', className)}>
      <div className="text-xl font-light">{header}</div>
      <div className="flex flex-col flex-1 rounded-[inherit] max-h-[500px] overflow-auto">{children}</div>
      <div className="absolute bottom-5 inset-x-0 bg-linear-to-t from-tui-dark from-10% to-transparent h-20" />
    </TuiCard>
  );
}

export namespace AppFrame {
  export type Props = {
    className?: string;
    header: string;
    children: ReactNode;
  };
}
