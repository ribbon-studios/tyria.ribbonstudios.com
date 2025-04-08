import { api } from '@/service/api';
import { selectRefreshInterval } from '@/store/settings.slice';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useIsTabFocused } from './use-is-focused';
import type { Achievement, Schema } from '@ribbon-studios/guild-wars-2/v2';

export function useAccountAchievements(options?: UseAccountAchievements.Options) {
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
    // Keep pinging if there are still incomplete achievements
    const enabled =
      !options?.achievements ||
      options?.achievements.some(({ id }) => {
        const account_achievement = account_achievements?.find((account_achievement) => account_achievement.id === id);

        return !account_achievement?.done;
      });

    if (!enabled || !refresh_interval) {
      setNextUpdateTimestamp(undefined);
    } else {
      const lastUpdatedAt = Math.max(dataUpdatedAt, errorUpdatedAt);
      setNextUpdateTimestamp(lastUpdatedAt + refresh_interval);
    }
  }, [dataUpdatedAt, errorUpdatedAt, options?.achievements]);

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

export namespace UseAccountAchievements {
  export type Options = {
    achievements?: Achievement<Schema.LATEST>[];
  };
}
