import { api } from '@/service/api';
import { useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { setHeader } from '@/store/app.slice';
import { Loading } from '@/components/common/Loading';
import { useSelector } from 'react-redux';
import { selectCategory, selectGroupByCategoryId } from '@/store/api.slice';
import { CategoryPageSlice } from './slices/CategoryPageSlice';
import { UseEnhancedAchievements, useEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { Achievement } from '@ribbon-studios/guild-wars-2/v2';

export function Component() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const categoryId = Number(params.id);

  const group = useSelector(selectGroupByCategoryId(categoryId));
  const category = useSelector(selectCategory(categoryId));

  const sorts = useMemo<UseEnhancedAchievements.SortKey[] | undefined>(() => {
    if (!group) return undefined;

    if (group.id === 'A4ED8379-5B6B-4ECC-B6E1-70C350C902D2') {
      return ['description', 'locked', 'done', 'meta'];
    }

    return undefined;
  }, [group?.id]);

  if (!group || !category) {
    return <Navigate to="/" />;
  }

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
  } = useEnhancedAchievements(
    {
      category,
      achievements,
      prerequisite_achievements,
    },
    sorts
  );

  useEffect(() => {
    dispatch(
      setHeader({
        breadcrumbs: [
          {
            label: category.name,
          },
        ],
        image: category.icon,
      })
    );
  }, [category]);

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
