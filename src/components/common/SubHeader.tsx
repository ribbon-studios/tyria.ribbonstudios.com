import { cn } from '@/utils/cn';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function SubHeader({ className, ...props }: SubHeader.Props) {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setRoot(document.getElementById('top-bar-root'));
  }, []);

  if (!root) return null;

  return createPortal(<div {...props} className={cn('flex items-center min-h-10 bg-tui-dark', className)} />, root);
}

export namespace SubHeader {
  export type Props = {
    children?: ReactNode;
  } & ComponentProps<'div'>;
}
