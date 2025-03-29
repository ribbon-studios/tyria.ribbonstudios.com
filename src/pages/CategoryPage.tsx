import { api, getCategoryAchievements, type CategoryAchievement } from '@/service/api';
import { useEffect, useRef, type FC } from 'react';
import { useLoaderData } from '@ribbon-studios/react-utils/react-router';
import { redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { setHeader } from '@/store/app.slice';
import { Loading } from '@/components/common/Loading';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { TimeTill } from '@/components/common/TimeTill';
import { useSelector } from 'react-redux';
import { selectRefreshInterval } from '@/store/account.slice';
import { TrueMasteryCard } from '@/components/achievements/TrueMasteryCard';
import { Achievement } from '@ribbon-studios/guild-wars-2/v2';
import { useSticky } from '@/hooks/use-sticky';
import { cn } from '@/utils/cn';
import * as styles from './CategoryPage.module.css';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = Number(params.id);

  if (!id) return redirect('/');

  return await api.v2.achievements.categories.get(id);
};

export const Component: FC = () => {
  const stickyHeader = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const refreshInterval = useSelector(selectRefreshInterval);
  const category = useLoaderData<typeof loader>();

  const sticky = useSticky(stickyHeader);

  useEffect(() => {
    dispatch(
      setHeader({
        label: category.name,
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
    refetchInterval: refreshInterval,
  });

  const { incompleteMetas, basics } = achievements.reduce<{
    incompleteMetas: CategoryAchievement[];
    basics: CategoryAchievement[];
  }>(
    (output, achievement) => {
      if (achievement.flags.includes(Achievement.Flags.CATEGORY_DISPLAY) && !achievement.done) {
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
    >
      <div
        className={cn('sticky top-[-1px] pt-[calc(1em+1px)] flex flex-col gap-2 z-50', sticky && styles.sticky)}
        ref={stickyHeader}
      >
        <TrueMasteryCard category={category} className={styles.pinnedCard} achievements={achievements}>
          <TimeTill loading={isFetching} timestamp={dataUpdatedAt ?? errorUpdatedAt} stale={refreshInterval} />
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
