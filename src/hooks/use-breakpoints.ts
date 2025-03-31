import { useEffect, useState } from 'react';

const breakpoints = {
  sm: 640, // 40rem
  md: 768, // 48rem
  lg: 1024, // 64rem
  xl: 1280, // 80rem
  '2xl': 1536, // 96rem'
};

export function useBreakpoints() {
  const [result, setResult] = useState<UseBreakpoints.Result>(() => UseBreakpoints.getResult());

  useEffect(() => {
    const listener = () => setResult(UseBreakpoints.getResult());

    window.addEventListener('resize', listener, {
      passive: true,
    });

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  return result;
}

export namespace UseBreakpoints {
  export type Result = {
    smAndUp: boolean;
    mdAndUp: boolean;
    lgAndUp: boolean;
    xlAndUp: boolean;
    '2xlAndUp': boolean;
  };

  export function getResult(): Result {
    const width = window.innerWidth;

    const twoXLAndUp = width >= breakpoints['2xl'];
    const xlAndUp = twoXLAndUp || width >= breakpoints.xl;
    const lgAndUp = xlAndUp || width >= breakpoints.lg;
    const mdAndUp = lgAndUp || width >= breakpoints.md;
    const smAndUp = mdAndUp || width >= breakpoints.sm;

    return {
      smAndUp,
      mdAndUp,
      lgAndUp,
      xlAndUp,
      '2xlAndUp': twoXLAndUp,
    };
  }
}
