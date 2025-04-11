import { useEffect, useMemo, useState, type FC, type ReactNode } from 'react';

export const TimeTill: FC<TimeTill.Props> = ({ timestamp, interval = 100, children }) => {
  const [percentage, setPercentage] = useState<number>();
  const total_seconds = useMemo(() => {
    if (!timestamp) return undefined;

    return Math.round((timestamp - Date.now()) / 1000);
  }, [timestamp]);

  useEffect(() => {
    if (!timestamp || !total_seconds) return;

    const timer = setInterval(() => {
      const seconds = Math.round((timestamp - Date.now()) / 1000);
      const seconds_elapsed = Math.abs(seconds - total_seconds);

      setPercentage((seconds_elapsed / total_seconds) * 100);

      if (seconds === 0) clearInterval(timer);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [timestamp, total_seconds, interval]);

  if (total_seconds === undefined || percentage === undefined) return null;

  return children({ total_seconds, percentage });
};

export namespace TimeTill {
  export type Props = {
    timestamp?: number;
    interval?: number;
    children: ({ total_seconds, percentage }: { total_seconds: number; percentage: number }) => ReactNode;
  };
}
