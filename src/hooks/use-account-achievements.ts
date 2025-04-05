import { api } from '@/service/api';
import { selectRefreshInterval } from '@/store/settings.slice';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

export function useAccountAchievements() {
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
    refetchInterval: refresh_interval,
  });

  return {
    refetch,
    isLoading,
    isFetching,
    lastUpdatedAt: Math.max(dataUpdatedAt, errorUpdatedAt),
    account_achievements,
  };
}
