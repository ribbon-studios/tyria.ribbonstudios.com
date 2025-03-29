import { useEffect, useState, type FC } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import * as styles from './TimeTill.module.css';
import { cn } from '@/utils/cn';

export const TimeTill: FC<TimeTill.Props> = ({ timestamp, stale, interval = 100, loading }) => {
  const [message, setMessage] = useState<string>();

  useEffect(() => {
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

  return <div className={cn(styles.timeTill, loading && styles.loading)}>auto refresh in {message}...</div>;
};

export namespace TimeTill {
  export type Props = {
    timestamp: number;
    stale: number;
    interval?: number;
    loading?: boolean;
  };
}
