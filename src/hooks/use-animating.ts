import { useEffect, useState, type RefObject } from 'react';

export function useAnimating(ref: RefObject<HTMLElement | null>) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const listeners = {
      start: () => setAnimating(true),
      end: () => setAnimating(false),
    };

    element.addEventListener('transitionstart', listeners.start);
    element.addEventListener('transitionend', listeners.end);

    return () => {
      element.removeEventListener('transitionstart', listeners.start);
      element.removeEventListener('transitionend', listeners.end);
    };
  }, [ref]);

  return animating;
}
