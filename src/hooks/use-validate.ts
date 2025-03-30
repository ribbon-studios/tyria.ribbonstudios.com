import { useMemo, useState } from 'react';

export function useValidate<T>(rules?: Array<UseValidate.Rule<T> | UseValidate.Coerce<T>>) {
  const [state, setState] = useState<UseValidate.State>({
    valid: true,
    messages: [],
  });

  return {
    ...state,
    validate: (value: T) => {
      const messages =
        rules
          ?.reduce<Array<boolean | string>>((output, rule) => {
            const result = rule(value);

            return [...output, ...(Array.isArray(result) ? result : [result])];
          }, [])
          .filter((result) => result !== true) ?? [];

      if (messages.length > 0) {
        setState({
          valid: false,
          messages: messages.filter((result) => typeof result === 'string'),
        });

        return false;
      }

      setState({
        valid: true,
        messages: [],
      });

      return true;
    },
  };
}

export namespace UseValidate {
  export type State = {
    valid: boolean;
    messages: string[];
  };

  export type Rule<T> = (value: T) => boolean | string;
  export type Coerce<T> = (value: T) => Array<boolean | string>;

  export type Message = string | (() => string);

  export function getMessage(message: Message) {
    return typeof message === 'function' ? message() : message;
  }

  export const rules = {
    required:
      (message: Message = 'Please provide a value.') =>
      (value: string) =>
        value ? true : getMessage(message),

    number:
      (message: Message = 'Please provide a number.') =>
      (value: string) => {
        if (value && isNaN(Number(value))) return getMessage(message);

        return true;
      },

    max: (max: number, message: Message = `Please provide a number less than ${max}.`) => {
      return (value?: number) => !value || (value > max ? getMessage(message) : true);
    },

    min: (min: number, message: Message = `Please provide a number greater than ${min}.`) => {
      return (value?: number) => !value || (value < min ? getMessage(message) : true);
    },
  };

  export const coerce = {
    number:
      (...rules: Rule<number>[]) =>
      (value: string) => {
        const parsedValue = (value && Number(value)) || undefined;

        if (parsedValue) return rules.map((rule) => rule(parsedValue));

        return [];
      },
  } satisfies Record<string, Coerce<any> | ((...args: any[]) => Coerce<any>)>;
}
