import { Children, ComponentType, isValidElement, ReactNode } from 'react';

export function useSlots<Slots extends UseSlots.Slots>(
  children: ReactNode,
  slots: Slots
): UseSlots.SlotsWithFallback<Slots> {
  const keys = Object.keys(slots) as Array<keyof Slots>;

  return Children.toArray(children).reduce<UseSlots.SlotsWithFallback<Slots>>((output, child) => {
    const key = (isValidElement(child) && keys.find((key) => child.type === slots[key])) || 'fallback';

    if (!output[key]) {
      output[key] = [] as ReactNode[];
    }

    output[key].push(child);

    return output;
  }, {});
}

export namespace UseSlots {
  export type Slots = Record<string, ComponentType<any>>;
  export type SlotsWithFallback<Slots extends UseSlots.Slots> = {
    [key in keyof Slots | 'fallback']?: ReactNode[];
  };
}
