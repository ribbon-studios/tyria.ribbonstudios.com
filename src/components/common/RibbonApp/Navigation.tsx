import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

export function RibbonAppNavigation({ children, className, ...props }: RibbonAppNavigation.Props) {
  return (
    <div {...props} className={cn('flex px-6 bg-tui-dark max-w-dvw min-h-[72px]', className)}>
      <div className="flex gap-2 md:gap-4 flex-1 items-center mx-auto w-full max-w-[1200px]">{children}</div>
    </div>
  );
}

export namespace RibbonAppNavigation {
  export type Props = {
    children?: ReactNode;
    className?: string;
  };
}
