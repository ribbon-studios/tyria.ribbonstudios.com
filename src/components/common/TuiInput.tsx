import { cn } from '@/utils/cn';
import { useCachedState } from '@ribbon-studios/react-utils';

import { type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';
import { SaveIndicator } from './SaveIndicator';
import { XCircle } from 'lucide-react';
import * as styles from './TuiInput.module.css';
import { useRandomId } from '@/hooks/use-random-id';
import { UseValidate, useValidate } from '@/hooks/use-validate';
import { TuiMessages } from './TuiMessages';

export const TuiInput: FC<TuiInput.Props> = ({
  label,
  className,
  value,
  loading,
  description,
  rules,
  subtext,
  onChange,
  prepend,
  ...props
}) => {
  const id = useRandomId('input', props.id);
  const { validate, messages } = useValidate(rules);

  const [internalValue, setInternalValue] = useCachedState<string | number>(() => value ?? '', [value]);

  return (
    <div className={cn(styles.container, className)}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      {description && <div className={styles.description}>{description}</div>}
      <div className="flex gap-2">
        {prepend}
        <div className={styles.input}>
          <input
            {...props}
            id={id}
            value={internalValue}
            onChange={(event) => {
              setInternalValue(event.target.value);
            }}
            onBlur={(event) => {
              if (event.target.value == value || !validate(event.target.value)) return;

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
      </div>
      <TuiMessages messages={messages} />
      {subtext && <div className={styles.subtext}>{subtext}</div>}
    </div>
  );
};

export namespace TuiInput {
  export type Props = {
    label?: string;
    value?: string | number;
    description?: ReactNode;
    subtext?: string;
    onChange?: (value: string | undefined) => void;
    loading?: boolean;
    prepend?: ReactNode;
    rules?: Array<UseValidate.Rule<string> | UseValidate.Coerce<string>>;
  } & Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'>;
}
