import { api, type ApiError } from '@/service/api';
import { useEffect, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loading } from '@/components/common/Loading';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { TuiCard } from '@/components/common/TuiCard';
import { ContentHeader } from '@/components/common/IncompletePage';
import { AchievementRewards } from '@/components/achievements/rewards/AchievementRewards';
import { DebugInfo } from '@/components/DebugInfo';
import { $header } from '@/store/app';
import { toast } from 'sonner';
import type { Achievement, Schema } from '@ribbon-studios/guild-wars-2/v2';
import { useEnhancedAchievement } from '@/hooks/use-enhanced-achievements';
import { useStore } from '@nanostores/react';
import { getCategoryByAchievementId } from '@/store/api';

export const Component: FC = () => {
  const params = useParams();
  // TODO: Is there a better way of doing this... ?
  const category = useStore(getCategoryByAchievementId(Number(params.id)));
  const navigate = useNavigate();

  const {
    data: { achievement, prerequisite_achievements } = {},
    isLoading,
    error,
  } = useQuery<
    {
      achievement: Achievement<Schema.LATEST>;
      prerequisite_achievements: Achievement<Schema.LATEST>[];
    },
    ApiError
  >({
    queryKey: ['achievements', params.id],
    queryFn: async () => {
      const achievement = await api.v2.achievements.get(Number(params.id));

      return {
        achievement,
        prerequisite_achievements: achievement.prerequisites?.length
          ? await api.v2.achievements.list({
              ids: achievement.prerequisites,
            })
          : [],
      };
    },
  });

  const { enhanced_achievement, isLoading: isAccountAchievementLoading } = useEnhancedAchievement({
    category,
    achievement,
    prerequisite_achievements,
  });

  useEffect(() => {
    if (!error || error.status !== 404) return;

    toast.error("Oops! Looks like the achievement you're looking for doesn't exist!");
    navigate('/');
  }, [error]);

  useEffect(() => {
    if (!category || !enhanced_achievement) return;

    $header.set({
      breadcrumbs: [
        {
          label: category.name,
          link: `/categories/${category.id}`,
        },
        {
          label: enhanced_achievement.name,
        },
      ],
      image: enhanced_achievement.icon,
    });
  }, [category, enhanced_achievement]);

  return (
    <>
      <ContentHeader.Incomplete />
      <Loading
        loading={isLoading || isAccountAchievementLoading}
        className="flex flex-col flex-1 items-center pt-12"
        contentClassName="gap-4 w-full max-w-[1200px]"
      >
        {error && (
          <TuiCard>
            <div className="text-lg font-light">Error!</div>
            <div className="whitespace-pre">{JSON.stringify(error, null, 4)}</div>
          </TuiCard>
        )}
        {enhanced_achievement && (
          <>
            <AchievementCard achievement={enhanced_achievement} />
            <TuiCard>
              <div className="flex flex-col items-start gap-1">
                <div className="text-sm font-bold">Requirement</div>
                {enhanced_achievement.requirement}
              </div>
              <AchievementRewards rewards={enhanced_achievement.rewards}>
                <div className="text-sm font-bold">Rewards</div>
              </AchievementRewards>
              <DebugInfo className="whitespace-pre overflow-x-auto py-2">
                {JSON.stringify(enhanced_achievement, null, 2)}
              </DebugInfo>
            </TuiCard>
          </>
        )}
      </Loading>
    </>
  );
};
