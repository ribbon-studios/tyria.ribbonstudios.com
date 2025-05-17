import { api } from '@/service/api';
import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { $header } from '@/store/app';
import { Loading } from '@/components/common/Loading';
import { CategoryPageSlice } from './slices/CategoryPageSlice';
import { useEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import { useStore } from '@nanostores/react';
import { getCategoryById, getGroupByCategoryId } from '@/store/api';

export function Component() {
  const params = useParams();

  const group = useStore(getGroupByCategoryId(Number(params.id)));
  const category = useStore(getCategoryById(Number(params.id)));

  if (!group || !category) {
    console.log('invalid');
    return <Navigate to="/" />;
  }

  useEffect(() => {
    $header.set({
      breadcrumbs: [{ label: category.name }],
      image: category.icon,
    });
  }, [category]);

  const { data: { achievements, prerequisite_achievements } = {}, isLoading } = useQuery({
    queryKey: ['v2/achievements/category', category.id],
    queryFn: async () => {
      let achievements = await api.v2.achievements.list({
        ids: category.achievements.map(({ id }) => id),
      });

      achievements = achievements.filter(
        (achievement) => !Component.UNSUPPORTED_ACHIEVEMENT_FLAGS.some((flag) => achievement.flags.includes(flag))
      );

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

  const {
    enhanced_achievements,
    nextUpdateTimestamp,
    isLoading: isAccountAchievementsLoading,
    isFetching,
    refetch,
  } = useEnhancedAchievements({
    category,
    achievements,
    prerequisite_achievements,
  });

  return (
    <Loading
      loading={isLoading || isAccountAchievementsLoading}
      className="flex flex-col flex-1 items-center"
      contentClassName="w-full gap-2"
      size={128}
    >
      <CategoryPageSlice
        category={category}
        achievements={enhanced_achievements}
        loading={isFetching}
        nextUpdateAt={nextUpdateTimestamp}
        onRefresh={() => refetch()}
      />
    </Loading>
  );
}

export namespace Component {
  export const UNSUPPORTED_ACHIEVEMENT_FLAGS = [
    Achievement.Flags.DAILY,
    Achievement.Flags.WEEKLY,
    Achievement.Flags.MONTHLY,
  ];
}
