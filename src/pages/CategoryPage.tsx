import { getCategoryAchievements, type CategoryAchievement } from '@/service/api';
import { useEffect, useMemo, useRef, type FC } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { setHeader } from '@/store/app.slice';
import { Loading } from '@/components/common/Loading';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { TimeTill } from '@/components/common/TimeTill';
import { useSelector } from 'react-redux';
import { selectSettings } from '@/store/settings.slice';
import { TrueMasteryCard } from '@/components/achievements/TrueMasteryCard';
import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import { useSticky } from '@/hooks/use-sticky';
import { cn } from '@/utils/cn';
import * as styles from './CategoryPage.module.css';
import { TuiLink } from '@/components/common/TuiLink';
import { selectCategory } from '@/store/api.slice';

export const Component: FC = () => {
  const params = useParams();
  const stickyHeader = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const settings = useSelector(selectSettings);
  const category = useSelector(selectCategory(Number(params.id)));
  const sticky = useSticky(stickyHeader);

  if (!category) {
    return <Navigate to="/" />;
  }

  const refresh_interval = useMemo(() => {
    if (settings.api.key && settings.api.refresh_interval) {
      return settings.api.refresh_interval * 1000;
    }

    return null;
  }, [settings.api.key, settings.api.refresh_interval]);

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
    refetchInterval: refresh_interval ?? undefined,
  });

  const { incompleteMetas, basics } = achievements.reduce<{
    incompleteMetas: CategoryAchievement[];
    basics: CategoryAchievement[];
  }>(
    (output, achievement) => {
      if (
        settings.toggles.pin_incomplete_meta_achievements &&
        achievement.flags.includes(Achievement.Flags.CATEGORY_DISPLAY) &&
        !achievement.done
      ) {
        output.incompleteMetas.push(achievement);
      } else {
        output.basics.push(achievement);
      }

      return output;
    },
    {
      incompleteMetas: [],
      basics: [],
    }
  );

  return (
    <Loading
      loading={isLoading}
      className="flex flex-col flex-1 items-center m-6"
      contentClassName="gap-2 w-full max-w-[1200px]"
      size={128}
    >
      <div
        className={cn('sticky top-[-1px] pt-[calc(1em+1px)] flex flex-col gap-2 z-50', sticky && styles.sticky)}
        ref={stickyHeader}
      >
        <TrueMasteryCard category={category} className={styles.pinnedCard} achievements={achievements}>
          {settings.api.key ? (
            <TimeTill loading={isFetching} timestamp={dataUpdatedAt ?? errorUpdatedAt} stale={refresh_interval} />
          ) : (
            <div className="hidden md:inline-block text-sm text-white/50">
              Provide an{' '}
              <TuiLink color="info" to="/settings">
                Api Key
              </TuiLink>{' '}
              to enable auto refresh...
            </div>
          )}
          <Button color="light" loading={isFetching} onClick={() => refetch()}>
            <RefreshCw />
            Refresh
          </Button>
        </TrueMasteryCard>
        {incompleteMetas.map((achievement) => (
          <AchievementCard className={styles.pinnedCard} key={achievement.id} achievement={achievement} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        {basics.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </Loading>
  );
};
