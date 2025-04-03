import { type EnhancedAchievement, getAchievement, type ApiError } from '@/service/api';
import { useEffect, useMemo, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '@/components/common/Loading';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { useSelector } from 'react-redux';
import { selectSettings } from '@/store/settings.slice';
import * as styles from './CategoryPage.module.css';
import { Card } from '@/components/common/Card';
import { ContentHeader } from '@/components/common/IncompletePage';
import { AchievementRewards } from '@/components/achievements/rewards/AchievementRewards';
import { DebugInfo } from '@/components/DebugInfo';
import { useAppDispatch } from '@/store';
import { setHeader } from '@/store/app.slice';
import { toast } from 'sonner';
import { selectCategoryByAchievementId } from '@/store/api.slice';

export const Component: FC = () => {
  const params = useParams();
  const settings = useSelector(selectSettings);
  const category = useSelector(selectCategoryByAchievementId(Number(params.id!)));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const refresh_interval = useMemo(() => {
    if (settings.api.key && settings.api.refresh_interval) {
      return settings.api.refresh_interval * 1000;
    }

    return null;
  }, [settings.api.key, settings.api.refresh_interval]);

  const {
    data: achievement,
    isLoading,
    error,
  } = useQuery<EnhancedAchievement, ApiError>({
    queryKey: ['achievements', params.id],
    queryFn: async () => ({
      icon: category?.icon,
      ...(await getAchievement(Number(params.id))),
    }),
    refetchInterval: refresh_interval ?? undefined,
  });

  useEffect(() => {
    if (!error || error.status !== 404) return;

    toast.error("Oops! Looks like the achievement you're looking for doesn't exist!");
    navigate('/');
  }, [error]);

  useEffect(() => {
    if (!category || !achievement) return;

    dispatch(
      setHeader({
        image: achievement.icon,
        breadcrumbs: [
          {
            label: category.name,
            link: `/categories/${category.id}`,
          },
          {
            label: achievement.name,
          },
        ],
      })
    );
  }, [category, achievement]);

  return (
    <>
      <ContentHeader.Incomplete />
      <Loading
        loading={isLoading}
        className="flex flex-col flex-1 items-center m-6"
        contentClassName="gap-4 w-full max-w-[1200px]"
      >
        {error && (
          <Card className="flex-col">
            <div className="text-lg font-light">Error!</div>
            <div className="whitespace-pre">{JSON.stringify(error, null, 4)}</div>
          </Card>
        )}
        {achievement && (
          <>
            <AchievementCard className={styles.pinnedCard} achievement={achievement} />
            <Card className="flex-col">
              <div className="flex flex-col items-start gap-1">
                <div className="text-sm font-bold">Requirement</div>
                {achievement.requirement}
              </div>
              <AchievementRewards rewards={achievement.rewards}>
                <div className="text-sm font-bold">Rewards</div>
              </AchievementRewards>
              <DebugInfo className="whitespace-pre overflow-x-auto py-2">
                {JSON.stringify(achievement, null, 2)}
              </DebugInfo>
            </Card>
          </>
        )}
      </Loading>
    </>
  );
};
