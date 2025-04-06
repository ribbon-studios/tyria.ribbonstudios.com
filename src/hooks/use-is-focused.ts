import { useEffect, useState } from 'react';

export function useIsTabFocused() {
  const [focused, setFocused] = useState<boolean>(document.hasFocus());

  useEffect(() => {
    const listeners = {
      focus: () => setFocused(true),
      blur: () => setFocused(false),
    };

    window.addEventListener('focus', listeners.focus);
    window.addEventListener('blur', listeners.blur);

    return () => {
      window.removeEventListener('focus', listeners.focus);
      window.removeEventListener('blur', listeners.blur);
    };
  }, []);

  return focused;
}
