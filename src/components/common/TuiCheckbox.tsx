import { useCachedState } from '@ribbon-studios/react-utils';
import { type FC } from 'react';
import * as styles from './TuiCheckbox.module.css';
import { cn } from '@/utils/cn';
import { useRandomId } from '@/hooks/use-random-id';
import { Tally4 } from 'lucide-react';

export const TuiCheckbox: FC<TuiCheckbox.Props> = ({ label, value, variant = 'checkbox', onChange, ...props }) => {
  const id = useRandomId('input', props.id);
  const [internalValue, setInternalValue] = useCachedState(() => value, [value]);

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={cn(styles.input, styles[variant], internalValue && styles.checked)}
        onClick={() => {
          const newValue = !internalValue;
          setInternalValue(newValue);
          onChange?.(newValue);
        }}
      >
        <div className={styles.check} />
      </div>
      <input {...props} id={id} className="hidden" type="checkbox" checked={internalValue} readOnly />
    </div>
  );
};

export namespace TuiCheckbox {
  export type Props = {
    id?: string;
    label?: string;
    value: boolean;
    variant?: 'checkbox' | 'toggle';
    onChange?: (value: boolean) => void;
  };
}
