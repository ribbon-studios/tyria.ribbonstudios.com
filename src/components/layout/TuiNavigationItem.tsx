import { cn } from '@/utils/cn';
import { ComponentProps, ElementType, ReactNode } from 'react';

export function TuiNavigationItem<T extends ElementType>({
  as,
  className,
  alternating,
  ...props
}: TuiNavigationItem.Props<T>) {
  const Component = as ?? 'div';

  return (
    <Component
      {...props}
      className={cn(
        'flex gap-2 px-4 py-2 relative before:absolute before:inset-0 hover:before:bg-amber-300/20 before:transition-colors cursor-pointer',
        alternating && 'even:bg-tui-gray',
        className
      )}
    />
  );
}

export namespace TuiNavigationItem {
  export type Props<T extends ElementType> = {
    as?: T;
    children?: ReactNode;
    alternating?: boolean;
  } & ComponentProps<T>;
}
