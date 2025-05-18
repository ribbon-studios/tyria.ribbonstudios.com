import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

export function RibbonAppSidebar({ children, className, ...props }: RibbonAppSidebar.Props) {
  return (
    <div {...props} className={cn('z-20 flex flex-col w-[350px] bg-tui-dark', className)}>
      {children}
    </div>
  );
}

export namespace RibbonAppSidebar {
  export type Props = {
    children?: ReactNode;
    className?: string;
  };
}
