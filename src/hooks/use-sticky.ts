import { useEffect, useState, type RefObject } from 'react';

export function useSticky(ref: RefObject<Element | null>): boolean {
  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;

    // get the sticky element
    const observer = new IntersectionObserver(
      ([e]) => {
        setIsSticky(e.intersectionRatio < 1);
      },
      {
        threshold: [1],
      }
    );

    observer.observe(ref.current);

    return () => {
      if (!ref.current) return;

      observer.unobserve(ref.current);
      observer.disconnect();
    };
  }, [ref]);

  return isSticky;
}
