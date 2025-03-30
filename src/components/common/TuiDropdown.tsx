import { Children, cloneElement, useEffect, useRef, useState, type FC, type ReactElement, type ReactNode } from 'react';
import * as styles from './TuiDropdown.module.css';
import { cn } from '@/utils/cn';
import { Card } from './Card';

export const TuiDropdown: FC<TuiDropdown.Props> = ({ button, children }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!dropdownRef.current) return;

    const dropdown = dropdownRef.current;

    const listener = (event: Event) => {
      if (event.composedPath().includes(dropdown)) return;

      setIsOpen(false);
    };

    document.body.addEventListener('click', listener);

    return () => {
      document.body.removeEventListener('click', listener);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      {Children.map(button, (child) =>
        cloneElement(child, {
          onClick: () => setIsOpen(!isOpen),
        })
      )}
      <Card className={cn(styles.dropdown, isOpen && styles.open)}>{children}</Card>
    </div>
  );
};

export namespace TuiDropdown {
  export type Props = {
    button: ReactElement<{ onClick: () => void }>;
    children: ReactNode;
  };
}
