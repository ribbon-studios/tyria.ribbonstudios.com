import { AchievementCard } from '@/components/achievements/AchievementCard';
import { Loading } from '@/components/common/Loading';
import { TuiCard } from '@/components/common/TuiCard';
import { useNearingCompletion } from '@/hooks/use-nearing-completion';
import { $header } from '@/store/app';
import { useEffect, type FC } from 'react';

export const Component: FC = () => {
  const { achievements, isLoading } = useNearingCompletion();

  useEffect(() => {
    $header.set({
      breadcrumbs: [],
    });
  }, []);

  return (
    <Loading loading={isLoading} contentClassName="gap-4" size={128}>
      <TuiCard className="text-xl font-light mt-4">Nearing Completion</TuiCard>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} basic />
        ))}
      </div>
    </Loading>
  );
};
