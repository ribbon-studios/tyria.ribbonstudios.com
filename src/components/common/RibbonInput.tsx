'use client';
import { cn } from '@/utils/cn';
import { ChangeEvent, ComponentProps } from 'react';

export function RibbonInput({ value, onChange, className, ...props }: RibbonInput.Props) {
  return (
    <input
      {...props}
      className={cn('bg-tui-light-gray py-2.5 px-4 rounded-md outline-none leading-none', className)}
      value={value}
      onChange={(event) => onChange?.(event.target.value, event)}
    />
  );
}

export namespace RibbonInput {
  export type Props = Omit<ComponentProps<'input'>, 'onChange'> & {
    onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  };
}
