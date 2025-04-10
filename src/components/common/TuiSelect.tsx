import { useMemo } from 'react';
import { useRandomId } from '@/hooks/use-random-id';
import { useCachedState } from '@ribbon-studios/react-utils';
import { TuiInput } from './TuiInput';
import { TuiDropdown } from './TuiDropdown';
import * as styles from './TuiSelect.module.css';
import { cn } from '@/utils/cn';

export function TuiSelect<T extends string | number>({
  label,
  description,
  items,
  value,
  align,
  onChange,
  ...props
}: TuiSelect.Props<T>) {
  const id = useRandomId('select', props.id);
  const [internalValue, setInternalValue] = useCachedState(() => value, [value]);
  const selectedItemLabel = useMemo(
    () => items.find((item) => item.value === internalValue)?.label,
    [items, internalValue]
  );

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      {description && <div className={styles.description}>{description}</div>}
      <TuiDropdown
        align={align}
        dropdownClassName={styles.select}
        dropdownContentClassName={styles.selectContent}
        button={
          <TuiInput
            className="cursor-pointer"
            inputClassName="pointer-events-none"
            value={selectedItemLabel}
            readOnly
          />
        }
      >
        {items.map((item) => (
          <button
            key={item.value}
            className={cn(styles.item, item.value === value && styles.selected)}
            onClick={() => {
              if (value === item.value) return;

              setInternalValue(item.value);
              onChange?.(item.value);
            }}
          >
            {item.label}
          </button>
        ))}
      </TuiDropdown>

      <select
        id={id}
        className="hidden"
        value={internalValue}
        onChange={(event) => setInternalValue(event.target.value as T)}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export namespace TuiSelect {
  export type Props<T> = {
    label?: string;
    description?: string;
    id?: string;
    items: LabelValue<T>[];
    value: T;
    onChange?: (value: T) => void;
    align?: TuiDropdown.Props['align'];
  };

  export type LabelValue<T> = {
    label: string;
    value: T;
  };
}
