import { useMemo } from 'react';

export function useRandomId(prefix: string, id?: string): string {
  return useMemo(() => {
    return id ?? `${prefix}-${Math.floor(Math.random() * 100000)}`;
  }, [id]);
}
