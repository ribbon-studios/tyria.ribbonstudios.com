import { Children, cloneElement, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import * as styles from './TuiTabs.module.css';
import { cn } from '@/utils/cn';
import { useCachedState } from '@ribbon-studios/react-utils';

export function TuiTabs({ children, value, onChange }: TuiTabs.Props) {
  const [internalValue, setInternalValue] = useCachedState(() => value, [value]);

  return (
    <div className={styles.tabs}>
      {Children.map(children, (child) =>
        cloneElement(child, {
          active: child.props.value === internalValue,
          onClick: () => {
            setInternalValue(child.props.value);
            onChange?.(child.props.value);
          },
        })
      )}
    </div>
  );
}

export namespace TuiTabs {
  export type Props = {
    children: ReactElement<Omit<Tab.Props, 'children'>> | ReactElement<Omit<Tab.Props, 'children'>>[];
    value?: string;
    onChange?: (value: string) => void;
  };

  export function Tab({ active, children, ...props }: Tab.Props) {
    return (
      <button {...props} className={cn(styles.tab, active && styles.active)}>
        {children}
      </button>
    );
  }

  export namespace Tab {
    export type Props = {
      active?: boolean;
      value: string;
      children: ReactNode;
    } & ComponentProps<'button'>;
  }
}
