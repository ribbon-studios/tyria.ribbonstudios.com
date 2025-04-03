import { getCategoryAchievements } from '@/service/api';
import { useEffect, type FC } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { setHeader } from '@/store/app.slice';
import { Loading } from '@/components/common/Loading';
import { useSelector } from 'react-redux';
import { selectRefreshInterval } from '@/store/settings.slice';
import { selectCategory } from '@/store/api.slice';
import { CategoryPageSlice } from './slices/CategoryPageSlice';

export const Component: FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const category = useSelector(selectCategory(Number(params.id)));
  const refresh_interval = useSelector(selectRefreshInterval);

  if (!category) {
    return <Navigate to="/" />;
  }

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

  const {
    data: achievements = [],
    isLoading,
    isFetching,
    refetch,
    dataUpdatedAt,
    errorUpdatedAt,
  } = useQuery({
    queryKey: ['category-achievements', category.id],
    queryFn: () => getCategoryAchievements(category),
    refetchInterval: refresh_interval,
  });

  return (
    <Loading
      loading={isLoading}
      className="flex flex-col flex-1 items-center m-6"
      contentClassName="gap-2 w-full max-w-[1200px]"
      size={128}
    >
      <CategoryPageSlice
        category={category}
        achievements={achievements}
        loading={isFetching}
        timestamp={dataUpdatedAt ?? errorUpdatedAt}
        onRefresh={() => refetch()}
      />
    </Loading>
  );
};
