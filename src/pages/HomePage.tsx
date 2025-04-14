import { AchievementCard } from '@/components/achievements/AchievementCard';
import { Loading } from '@/components/common/Loading';
import { TuiCard } from '@/components/common/TuiCard';
import { useNearingCompletion } from '@/hooks/use-nearing-completion';
import { useAppDispatch } from '@/store';
import { setHeader } from '@/store/app.slice';
import { selectSettings } from '@/store/settings.slice';
import { useEffect, type FC } from 'react';
import { useSelector } from 'react-redux';

export const Component: FC = () => {
  const settings = useSelector(selectSettings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      setHeader({
        breadcrumbs: [],
      })
    );
  }, []);

  if (!settings.api.key) return null;

  const { achievements, isLoading } = useNearingCompletion();

  return (
    <Loading loading={isLoading} contentClassName="gap-4">
      <TuiCard className="text-xl font-light mt-4">Nearing Completion</TuiCard>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} basic />
        ))}
      </div>
    </Loading>
  );
};
