import type { Color } from '@/types';

export function variable(name: string): string;
export function variable(name?: string | null): string | undefined;
export function variable(name?: string | null): string | undefined {
  return name ? `var(--${name})` : undefined;
}

export namespace variable {
  export function tui(name: Color): string;
  export function tui(name?: Color | null): string | undefined;
  export function tui(name?: Color | null): string | undefined {
    return name ? variable(`color-tui-${name}`) : undefined;
  }
}
