import { useEffect, useState } from 'react';
import { useIsTabFocused } from './use-is-focused';
import { type AccountAchievement, type Achievement, type Schema } from '@ribbon-studios/guild-wars-2/v2';
import { $api, $refresh_interval_ms } from '@/store/settings';
import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/service/api';

export function useAccountAchievements(options?: UseAccountAchievements.Options) {
  const isFocused = useIsTabFocused();
  const [nextUpdateTimestamp, setNextUpdateTimestamp] = useState<number>();
  const { key } = useStore($api);
  const refresh_interval = useStore($refresh_interval_ms);

  const {
    data: account_achievements,
    dataUpdatedAt,
    errorUpdatedAt,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<AccountAchievement<Schema.LATEST>[]>({
    queryKey: ['v2/account/achievements', key],
    queryFn: async () => {
      if (!key) return [];

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
