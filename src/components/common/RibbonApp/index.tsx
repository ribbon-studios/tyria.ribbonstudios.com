import { ComponentProps, ElementType, ReactNode } from 'react';
import { RibbonAppNavigation } from './Navigation';
import { RibbonAppSidebar } from './Sidebar';
import { useSlots } from '@/hooks/use-slots';
import { cn } from '@/utils/cn';
import { RibbonAppBackground } from './Background';

export function RibbonApp<T extends ElementType = 'div'>({ as, children, className, ...props }: RibbonApp.Props<T>) {
  const Component = as ?? 'div';

  const { navigation, sidebar, background, fallback } = useSlots(children, {
    navigation: RibbonApp.Navigation,
    sidebar: RibbonApp.Sidebar,
    background: RibbonApp.Background,
  });

  return (
    <Component {...props} className={cn('flex min-h-dvh max-h-dvh antialiased relative', className)}>
      {sidebar}
      {background}
      <div className="flex flex-col flex-1">
        {navigation}
        <div className="flex flex-col flex-1 overflow-auto">{fallback}</div>
      </div>
    </Component>
  );
}
export namespace RibbonApp {
  export type Props<T extends ElementType> = {
    as?: T;
    className?: string;
  } & ComponentProps<T>;

  export type Slots = {
    navigation?: ReactNode;
    sidebar?: ReactNode;
    content: ReactNode[];
  };

  export const Navigation = RibbonAppNavigation;
  export const Sidebar = RibbonAppSidebar;
  export const Background = RibbonAppBackground;
}
