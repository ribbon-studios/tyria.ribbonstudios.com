import { selectToggle } from '@/store/settings.slice';
import { cn } from '@/utils/cn';
import type { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';

export const DebugInfo: FC<DebugInfo.Props> = ({ children, className }) => {
  const debug_mode = useSelector(selectToggle('debug_mode'));

  if (!debug_mode) return null;

  return (
    <div
      className={cn(
        'border-2 border-dashed bg-tui-info border-white/50 px-2 py-0.5 rounded-lg text-xs text-nowrap overflow-hidden text-ellipsis',
        className
      )}
      title={children}
    >
      {children}
    </div>
  );
};

export namespace DebugInfo {
  export type Props = {
    children: string;
    className?: string;
  };
}
