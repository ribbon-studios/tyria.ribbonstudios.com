import { useEffect, useState, type FC } from 'react';

export const TimeTill: FC<TimeTill.Props> = ({ timestamp, interval = 100, suffix }) => {
  const [seconds, setSeconds] = useState<number>();

  useEffect(() => {
    if (!timestamp) return;

    const timer = setInterval(() => {
      const seconds = Math.round((timestamp - Date.now()) / 1000);

      setSeconds(seconds);

      if (seconds === 0) clearInterval(timer);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [timestamp, interval]);

  if (seconds === undefined) return null;

  return (
    <>
      {seconds}
      {suffix}
    </>
  );
};

export namespace TimeTill {
  export type Props = {
    timestamp?: number;
    interval?: number;
    suffix?: string;
  };
}
