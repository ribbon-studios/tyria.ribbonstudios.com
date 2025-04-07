import { cn } from '@/utils/cn';
import { type ComponentProps, type ReactNode } from 'react';

export function TuiBadge({ children, className, ...props }: TuiBadge.Props) {
  return (
    <div
      {...props}
      className={cn('inline-flex items-center justify-center rounded-full px-2 bg-tui-info min-h-6', className)}
    >
      {children}
    </div>
  );
}

export namespace TuiBadge {
  export type Props = {
    children?: ReactNode;
  } & ComponentProps<'div'>;
}
