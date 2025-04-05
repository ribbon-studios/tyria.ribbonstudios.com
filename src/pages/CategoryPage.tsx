import { api } from '@/service/api';
import { useEffect, type FC } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { setHeader } from '@/store/app.slice';
import { Loading } from '@/components/common/Loading';
import { useSelector } from 'react-redux';
import { selectCategory } from '@/store/api.slice';
import { CategoryPageSlice } from './slices/CategoryPageSlice';
import { useEnhancedAchievements } from '@/hooks/use-enhanced-achievements';

export const Component: FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const category = useSelector(selectCategory(Number(params.id)));

  if (!category) {
    return <Navigate to="/" />;
  }

  const { data: { achievements, prerequisite_achievements } = {}, isLoading } = useQuery({
    queryKey: ['v2/achievements/category', category.id],
    queryFn: async () => {
      const achievements = await api.v2.achievements.list({
        ids: category.achievements.map(({ id }) => id),
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

  const { enhanced_achievements, lastUpdatedAt, isFetching, refetch } = useEnhancedAchievements({
    category,
    achievements,
    prerequisite_achievements,
  });

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
      loading={isLoading}
      className="flex flex-col flex-1 items-center m-6"
      contentClassName="gap-2 w-full max-w-[1200px]"
      size={128}
    >
      <CategoryPageSlice
        category={category}
        achievements={enhanced_achievements}
        loading={isFetching}
        timestamp={lastUpdatedAt}
        onRefresh={() => refetch()}
      />
    </Loading>
  );
};
