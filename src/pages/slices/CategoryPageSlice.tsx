import { useEffect, useMemo, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { TimeTill } from '@/components/common/TimeTill';
import { useSelector } from 'react-redux';
import { selectRefreshInterval, selectSettings } from '@/store/settings.slice';
import { MasteryCard } from '@/components/achievements/MasteryCard';
import { Achievement, AchievementCategory, Schema } from '@ribbon-studios/guild-wars-2/v2';
import { useSticky } from '@/hooks/use-sticky';
import { cn } from '@/utils/cn';
import * as styles from './CategoryPageSlice.module.css';
import { TuiLink } from '@/components/common/TuiLink';
import { useQuery } from '@tanstack/react-query';
import { delay, rfetch } from '@ribbon-studios/js-utils';
import { Loading } from '@/components/common/Loading';
import { useAppDispatch } from '@/store';
import { MasteryTier, selectMasteryCategory, setMasteryTier } from '@/store/mastery.slice';
import { computeMasteryTier } from '@/utils/achievements';
import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';
import { TuiIcon } from '@/components/common/TuiIcon';
import { TuiBadge } from '@/components/common/TuiBadge';

export function CategoryPageSlice({
  category,
  achievements,
  loading,
  nextUpdateAt,
  onRefresh,
}: CategoryPageSlice.Props) {
  const mastery = useSelector(selectMasteryCategory(category.id));
  const dispatch = useAppDispatch();
  const stickyHeader = useRef<HTMLDivElement>(null);
  const settings = useSelector(selectSettings);
  const sticky = useSticky(stickyHeader);

  if (!category) {
    return <Navigate to="/" />;
  }

  const { incompleteMetas, basics } = achievements.reduce<{
    incompleteMetas: UseEnhancedAchievements.Achievement[];
    basics: UseEnhancedAchievements.Achievement[];
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

  useEffect(() => {
    if (mastery === MasteryTier.TRUE) return;

    const currentMasteryTier = computeMasteryTier(achievements);

    if (typeof currentMasteryTier === 'undefined' || mastery === currentMasteryTier) return;

    dispatch(setMasteryTier([category.id, currentMasteryTier]));
  }, [achievements]);

  return (
    <>
      <div
        className={cn('sticky top-[-1px] pt-[calc(1.5em+1px)] flex flex-col gap-2 z-50', sticky && styles.sticky)}
        ref={stickyHeader}
      >
        <MasteryCard category={category} className={styles.pinnedCard} achievements={achievements}>
          {!settings.api.key && (
            <div className="hidden md:inline-block text-sm text-white/50">
              Provide an{' '}
              <TuiLink color="info" to="/settings">
                Api Key
              </TuiLink>{' '}
              to enable auto refresh...
            </div>
          )}
          <Button color="light" loading={loading} onClick={onRefresh}>
            <TuiIcon icon={RefreshCw} />
            Refresh
            {settings.api.key && nextUpdateAt && (
              <TuiBadge className="text-sm rounded-md min-w-10.5">
                <TimeTill timestamp={nextUpdateAt} suffix="s" />
              </TuiBadge>
            )}
          </Button>
        </MasteryCard>
        {incompleteMetas.map((achievement) => (
          <AchievementCard className={styles.pinnedCard} key={achievement.id} achievement={achievement} />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        {basics.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </>
  );
}

export namespace CategoryPageSlice {
  export type Props = {
    category: AchievementCategory<Schema.LATEST>;
    achievements: UseEnhancedAchievements.Achievement[];
    loading?: boolean;
    nextUpdateAt?: number;
    onRefresh: () => void;
  };

  export function Demo() {
    const refresh_interval = useSelector(selectRefreshInterval);
    const category = useMemo<Props['category']>(() => {
      return {
        id: 139,
        name: 'Out of the Shadows',
        description: '',
        order: 80,
        icon: 'https://render.guildwars2.com/file/3D0EE32F9FA92149C71DB1C1A30CF9ED0241D82D/1466306.png',
        achievements: [
          3040, 3042, 3043, 3049, 3050, 3053, 3054, 3056, 3059, 3060, 3061, 3062, 3064, 3065, 3066, 3070, 3071, 3072,
          3073, 3074, 3075, 3076, 3077, 3078, 3081, 3082, 3084, 3088,
        ].map((id) => ({ id })),
      };
    }, []);

    const {
      data: achievements = [],
      refetch,
      dataUpdatedAt,
      isLoading,
      isFetching,
    } = useQuery<UseEnhancedAchievements.Achievement[]>({
      queryKey: ['category-achievements/demo'],
      queryFn: () => delay(rfetch.get('/demo/category-achievements.json'), 1000),
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
          nextUpdateAt={dataUpdatedAt}
          loading={isFetching}
          onRefresh={() => refetch()}
        />
      </Loading>
    );
  }
}
