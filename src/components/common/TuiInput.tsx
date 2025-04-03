import { cn } from '@/utils/cn';
import { useCachedState } from '@ribbon-studios/react-utils';

import { useState, type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';
import { SaveIndicator } from './SaveIndicator';
import { XCircle } from 'lucide-react';
import * as styles from './TuiInput.module.css';
import { useRandomId } from '@/hooks/use-random-id';
import { UseValidate, useValidate } from '@/hooks/use-validate';
import { TuiMessages } from './TuiMessages';

export const TuiInput: FC<TuiInput.Props> = ({
  label,
  className,
  inputClassName,
  value,
  loading,
  description,
  rules,
  subtext,
  onChange,
  prepend,
  readOnly,
  onClick,
  type,
  ...props
}) => {
  const id = useRandomId('input', props.id);
  const { validate, messages } = useValidate(rules);
  const [isFocused, setIsFocused] = useState(false);

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
        <div className={styles.input} onClick={onClick}>
          <input
            {...props}
            className={inputClassName}
            readOnly={readOnly}
            id={id}
            value={internalValue}
            type={type === 'password' && isFocused ? 'text' : type}
            onChange={(event) => {
              setInternalValue(event.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={(event) => {
              setIsFocused(false);

              if (!validate(event.target.value) || event.target.value == value) return;

              onChange?.(event.target.value);
            }}
          />

          <SaveIndicator loading={loading} />
          {!readOnly && (
            <XCircle
              className={cn(styles.clear, (loading || !internalValue) && 'opacity-0 pointer-events-none')}
              size={28}
              onClick={() => {
                setInternalValue('');
                onChange?.(undefined);
              }}
            />
          )}
        </div>
      </div>
      <TuiMessages messages={messages} />
      {subtext && <div className={styles.subtext}>{subtext}</div>}
    </div>
  );
};

export namespace TuiInput {
  export type Props = {
    inputClassName?: string;
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
