import { api } from '@/service/api';
import { selectRefreshInterval } from '@/store/settings.slice';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIsTabFocused } from './use-is-focused';

export function useAccountAchievements() {
  const isFocused = useIsTabFocused();
  const [nextUpdateTimestamp, setNextUpdateTimestamp] = useState<number>();
  const refresh_interval = useSelector(selectRefreshInterval);

  const {
    data: account_achievements,
    dataUpdatedAt,
    errorUpdatedAt,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['v2/account/achievements', api.config.access_token],
    queryFn: async () => {
      if (!api.config.access_token) return [];

      return api.v2.account.achievements();
    },
  });

  useEffect(() => {
    if (refresh_interval) {
      const lastUpdatedAt = Math.max(dataUpdatedAt, errorUpdatedAt);
      setNextUpdateTimestamp(lastUpdatedAt + refresh_interval);
    } else {
      setNextUpdateTimestamp(undefined);
    }
  }, [dataUpdatedAt, errorUpdatedAt]);

  useEffect(() => {
    if (!nextUpdateTimestamp) return;

    const delay = nextUpdateTimestamp - Date.now();

    if (delay <= 0) refetch();
    else {
      const timeout = setTimeout(() => refetch(), delay);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [nextUpdateTimestamp, isFocused]);

  return {
    refetch,
    isLoading,
    isFetching,
    nextUpdateTimestamp,
    account_achievements,
  };
}
