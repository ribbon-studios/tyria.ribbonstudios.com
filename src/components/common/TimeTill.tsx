import { useEffect, useState, type FC } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import * as styles from './TimeTill.module.css';
import { cn } from '@/utils/cn';

export const TimeTill: FC<TimeTill.Props> = ({ className, timestamp, stale, interval = 100, loading }) => {
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (!stale) return undefined;

    const staleTimestamp = timestamp + stale;

    const timer = setInterval(() => {
      setMessage(
        formatDistanceToNowStrict(staleTimestamp, {
          unit: 'second',
        })
      );
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [timestamp, stale, interval]);

  if (!message) return null;

  return (
    <div className={cn(styles.timeTill, (!stale || loading) && styles.loading, className)}>
      auto refresh in {message}...
    </div>
  );
};

export namespace TimeTill {
  export type Props = {
    className?: string;
    timestamp: number;
    stale: number | null;
    interval?: number;
    loading?: boolean;
  };
}
