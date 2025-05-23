import { cn } from '@/utils/cn';
import { Siren, TriangleAlert } from 'lucide-react';
import { type FC, type ReactNode } from 'react';
import { SubHeader } from './SubHeader';

export function ContentHeader({ children, className }: ContentHeader.Props) {
  return (
    <SubHeader className="bg-tui-dark/50">
      <div className={cn('flex mx-auto px-6 py-0.5 w-full max-w-[1200px] items-center', className)}>{children}</div>
    </SubHeader>
  );
}

export namespace ContentHeader {
  export type Props = {
    children?: ReactNode;
    className?: string;
  };

  export const Incomplete: FC = () => {
    return (
      <ContentHeader>
        <TriangleAlert className="hidden lg:inline-flex text-tui-warning" size={32} />
        <Siren className="text-tui-error" size={32} />
        <TriangleAlert className="hidden md:inline-flex text-tui-warning" size={32} />
        <div className="flex-1 text-center font-bold">This page is actively a work in progress.</div>
        <TriangleAlert className="hidden md:inline-flex text-tui-warning" size={32} />
        <Siren className="text-tui-error" size={32} />
        <TriangleAlert className="hidden lg:inline-flex text-tui-warning" size={32} />
      </ContentHeader>
    );
  };
}
