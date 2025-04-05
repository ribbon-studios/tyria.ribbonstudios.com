import { cn } from '@/utils/cn';
import { useCachedState } from '@ribbon-studios/react-utils';

import { type ComponentProps, useMemo, useState, type ComponentPropsWithoutRef, type FC, type ReactNode } from 'react';
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
  mode = 'blur',
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
            onFocus={() => setIsFocused(true)}
            onInput={(event) => {
              setInternalValue(event.currentTarget.value);

              if (
                mode !== 'input' ||
                !validate(event.currentTarget.value) ||
                event.currentTarget.value === value?.toString()
              )
                return;

              onChange?.(event.currentTarget.value);
            }}
            onBlur={(event) => {
              setIsFocused(false);

              if (mode !== 'blur' || !validate(event.target.value) || event.currentTarget.value === value?.toString())
                return;

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
    mode?: 'blur' | 'input';
  } & Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'>;
}
