import { useEffect, useState } from 'react';

export function useDelayedLoading(loading: boolean, ms?: number): boolean;
export function useDelayedLoading(loading?: boolean, ms?: number): boolean | undefined;
export function useDelayedLoading(loading?: boolean, ms?: number): boolean | undefined {
  const [internalLoading, setInternalLoading] = useState(loading);

  useEffect(() => {
    if (loading) setInternalLoading(loading);
    else if (ms) setTimeout(() => setInternalLoading(loading), ms);
    else setInternalLoading(loading);
  }, [loading]);

  return internalLoading;
}
