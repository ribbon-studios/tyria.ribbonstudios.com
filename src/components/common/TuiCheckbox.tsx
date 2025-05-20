import { useCachedState } from '@ribbon-studios/react-utils';
import * as styles from './TuiCheckbox.module.css';
import { cn } from '@/utils/cn';
import { useRandomId } from '@/hooks/use-random-id';

export function TuiCheckbox({ label, value, variant = 'checkbox', onChange, ...props }: TuiCheckbox.Props) {
  const id = useRandomId('input', props.id);
  const [internalValue, setInternalValue] = useCachedState(() => value, [value]);

  return (
    <div className={cn(styles.container, styles[variant], internalValue && styles.checked)}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={styles.input}
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
}

export namespace TuiCheckbox {
  export type Props = {
    id?: string;
    label?: string;
    value: boolean;
    variant?: 'checkbox' | 'toggle';
    onChange?: (value: boolean) => void;
  };
}
