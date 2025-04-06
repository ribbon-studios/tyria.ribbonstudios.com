import { useEffect, useState, type FC } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import * as styles from './TimeTill.module.css';
import { cn } from '@/utils/cn';

export const TimeTill: FC<TimeTill.Props> = ({ className, timestamp, interval = 100, loading }) => {
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (!timestamp) return;

    const timer = setInterval(() => {
      setMessage(
        formatDistanceToNowStrict(timestamp, {
          unit: 'second',
        })
      );
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [timestamp, interval]);

  if (!message) return null;

  return (
    <div className={cn(styles.timeTill, (!timestamp || loading) && styles.loading, className)}>
      auto refresh in {message}...
    </div>
  );
};

export namespace TimeTill {
  export type Props = {
    className?: string;
    timestamp?: number;
    interval?: number;
    loading?: boolean;
  };
}
