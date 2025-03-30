import { getAchievement } from '@/service/api';
import { useEffect, useMemo, type FC } from 'react';
import { useParams } from 'react-router-dom';
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

export const Component: FC = () => {
  const params = useParams();
  const settings = useSelector(selectSettings);
  const dispatch = useAppDispatch();

  const refresh_interval = useMemo(() => {
    if (settings.api.key && settings.api.refresh_interval) {
      return settings.api.refresh_interval * 1000;
    }

    return null;
  }, [settings.api.key, settings.api.refresh_interval]);

  const { data: achievement, isLoading } = useQuery({
    queryKey: ['achievements', params.id],
    queryFn: () => getAchievement(Number(params.id)),
    refetchInterval: refresh_interval ?? undefined,
  });

  useEffect(() => {
    if (!achievement) return;

    dispatch(
      setHeader({
        label: achievement.name,
      })
    );
  }, [achievement]);

  return (
    <>
      <ContentHeader.Incomplete />
      <Loading
        loading={isLoading}
        className="flex flex-col flex-1 items-center m-6"
        contentClassName="gap-4 w-full max-w-[1200px]"
      >
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
