import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as styles from './Accordion.module.css';
import { cn } from '@/utils/cn';

export function Accordion({
  children,
  className,
  activeClassName,
  contentClassName,
  isOpen,
  onOpenFinished,
  onCloseFinished,
}: Accordion.Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!childrenRef.current || !containerRef.current) {
      return;
    }

    if (!isOpen) {
      setHeight(0);
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      setHeight(childrenRef.current!.clientHeight);
    });

    resizeObserver.observe(childrenRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef.current, childrenRef.current, isOpen]);

  return (
    <div
      ref={containerRef}
      className={cn(styles.accordion, className, isOpen && [styles.open, activeClassName])}
      style={{
        height: `${height}px`,
      }}
      onTransitionEnd={(event) => {
        // Ignore events from the children.
        if (event.target !== event.currentTarget) return;

        if (isOpen) onOpenFinished?.();
        else onCloseFinished?.();
      }}
    >
      <div ref={childrenRef} className={contentClassName}>
        {children}
      </div>
    </div>
  );
}

export namespace Accordion {
  export type Props = {
    children: ReactNode;
    activeClassName?: string;
    className?: string;
    contentClassName?: string;
    isOpen?: boolean;
    onOpenFinished?: () => void;
    onCloseFinished?: () => void;
  };
}
