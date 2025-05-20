import { Children, cloneElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import * as styles from './TuiDropdown.module.css';
import { cn } from '@/utils/cn';
import { TuiCard } from './TuiCard';

export function TuiDropdown({
  align = 'left',
  button,
  children,
  className,
  dropdownClassName,
  dropdownContentClassName,
  ...props
}: TuiDropdown.Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!dropdownRef.current) return;

    const dropdown = dropdownRef.current;

    const listener = (event: Event) => {
      if (event.composedPath().includes(dropdown)) return;

      setOpen(false);
    };

    document.body.addEventListener('click', listener);

    return () => {
      document.body.removeEventListener('click', listener);
    };
  }, []);

  return (
    <div {...props} className={cn(styles.container, styles[align], open && styles.open, className)} ref={dropdownRef}>
      {Children.map(button, (child) =>
        cloneElement(child, {
          onClick: () => setOpen(!open),
        })
      )}
      <TuiCard
        className={cn(styles.dropdown, dropdownClassName)}
        contentClassName={dropdownContentClassName}
        onClick={() => setOpen(false)}
      >
        {children}
      </TuiCard>
    </div>
  );
}

export namespace TuiDropdown {
  export type Props = {
    button: ReactElement<{ onClick: () => void }>;
    children: ReactNode;
    align?: 'left' | 'center' | 'right' | 'full';
    className?: string;
    dropdownClassName?: string;
    dropdownContentClassName?: string;
  };
}
