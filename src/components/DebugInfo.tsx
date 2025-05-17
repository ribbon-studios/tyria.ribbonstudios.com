import { $toggles } from '@/store/settings';
import { cn } from '@/utils/cn';
import { useStore } from '@nanostores/react';
import type { ComponentProps, ElementType, ReactNode } from 'react';

export function DebugInfo<T extends ElementType>({ as, children, className, ...props }: DebugInfo.Props<T>) {
  const Component = as ?? 'div';
  const { debug_mode } = useStore($toggles);

  if (!debug_mode) return null;

  return (
    <Component
      {...props}
      className={cn(
        'border-2 border-dashed bg-tui-info border-white/50 px-2 py-0.5 rounded-lg text-xs text-nowrap overflow-hidden text-ellipsis',
        className
      )}
    >
      {children}
    </Component>
  );
}

export namespace DebugInfo {
  export type Props<T extends ElementType = 'div'> = {
    as?: T;
    children: ReactNode;
    className?: string;
  } & ComponentProps<T>;
}
