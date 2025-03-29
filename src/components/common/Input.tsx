import { cn } from '@/utils/cn';
import { useCachedState } from '@ribbon-studios/react-utils';

import { type ComponentPropsWithoutRef, type FC } from 'react';
import { SaveIndicator } from './SaveIndicator';
import { XCircle } from 'lucide-react';
import * as styles from './Input.module.css';

export type InputProps = {
  onChange?: (value: string | undefined) => void;
  loading?: boolean;
} & Omit<ComponentPropsWithoutRef<'input'>, 'onChange'>;

export const Input: FC<InputProps> = ({ onChange, className, value, loading, ...props }) => {
  const [internalValue, setInternalValue] = useCachedState(() => value, [value]);

  return (
    <div className={cn(styles.container, 'bg-amber-700 text-white', className)}>
      <input
        {...props}
        className={styles.input}
        value={internalValue}
        onChange={(event) => {
          setInternalValue(event.target.value);
          onChange?.(event.target.value);
        }}
      />
      <SaveIndicator loading={loading} />
      <XCircle
        className={cn(styles.clear, (loading || !internalValue) && 'opacity-0 pointer-events-none')}
        size={28}
        onClick={() => {
          setInternalValue('');
          onChange?.(undefined);
        }}
      />
    </div>
  );
};
