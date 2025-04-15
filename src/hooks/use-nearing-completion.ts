import { useMemo } from 'react';
import { useAccountAchievements } from './use-account-achievements';
import { api } from '@/service/api';
import { useQuery } from '@tanstack/react-query';
import { UseEnhancedAchievements } from './use-enhanced-achievements';
import { useSelector } from 'react-redux';
import { selectCategories } from '@/store/api.slice';

export function useNearingCompletion() {
  const categories = useSelector(selectCategories);
  const {
    account_achievements,
    isLoading: isAccountAchievementsLoading,
    isFetching: isAccountAchievementsFetching,
  } = useAccountAchievements();

  const achievement_ids = useMemo(() => {
    if (!account_achievements) return null;

    return account_achievements
      .filter(
        ({ id, done }) =>
          !done && categories.some((category) => category.achievements.some((achievement) => achievement.id === id))
      )
      .sort((a, b) => {
        const progress = {
          a: a.current && a.max ? a.current / a.max : 0,
          b: b.current && b.max ? b.current / b.max : 0,
        };

        if (progress.a < progress.b) return 1;
        if (progress.a > progress.b) return -1;
        return 0;
      })
      .splice(0, 10)
      .map(({ id }) => id);
  }, [account_achievements]);

  const {
    data: { achievements, prerequisite_achievements } = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['v2/achievements/nearing-completion', achievement_ids],
    queryFn: async () => {
      if (!achievement_ids) return {};

      const achievements = await api.v2.achievements.list({
        ids: achievement_ids,
      });

      const prerequisite_achievement_ids = achievements.reduce<number[]>((ids, achievement) => {
        return achievement.prerequisites ? ids.concat(achievement.prerequisites) : ids;
      }, []);

      const prerequisite_achievements =
        prerequisite_achievement_ids.length > 0
          ? await api.v2.achievements.list({
              ids: prerequisite_achievement_ids,
            })
          : [];

      return {
        achievements,
        prerequisite_achievements,
      };
    },
  });

  return {
    achievements: useMemo(() => {
      if (!achievements || !prerequisite_achievements || !account_achievements) return [];

      return achievements.map((achievement) => {
        const category = categories.find((category) => category.achievements.some(({ id }) => id === achievement.id));

        return UseEnhancedAchievements.enhance(category, achievement, prerequisite_achievements, account_achievements);
      });
    }, [achievements, prerequisite_achievements, account_achievements, categories]),
    isLoading: isLoading || isAccountAchievementsLoading,
    isFetching: isFetching || isAccountAchievementsFetching,
  };
}
