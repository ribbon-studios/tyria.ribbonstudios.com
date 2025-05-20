import { cn } from '@/utils/cn';
import { useCachedState } from '@ribbon-studios/react-utils';

import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { SaveIndicator } from './SaveIndicator';
import { XCircle } from 'lucide-react';
import * as styles from './TuiInput.module.css';
import { useRandomId } from '@/hooks/use-random-id';
import { UseValidate, useValidate } from '@/hooks/use-validate';
import { TuiMessages } from './TuiMessages';

export function TuiInput({
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
  prependInner,
  append,
  appendInner,
  readOnly,
  onClick,
  type,
  mode = 'blur',
  ...props
}: TuiInput.Props) {
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
      <div className="flex flex-wrap gap-2">
        {prepend}
        <div className={cn(styles.input)} onClick={onClick}>
          {prependInner && <div className="pl-4">{prependInner}</div>}
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

          {appendInner}
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
        {append}
      </div>
      <TuiMessages messages={messages} />
      {subtext && <div className={styles.subtext}>{subtext}</div>}
    </div>
  );
}

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
    prependInner?: ReactNode;
    appendInner?: ReactNode;
    rules?: Array<UseValidate.Rule<string> | UseValidate.Coerce<string>>;
    mode?: 'blur' | 'input';
    append?: ReactNode;
  } & Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'>;
}
