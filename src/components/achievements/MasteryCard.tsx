import { ProgressBar } from '@/components/common/ProgressBar';
import { TuiCard } from '@/components/common/TuiCard';
import { cn } from '@/utils/cn';
import { useMemo, type ReactNode } from 'react';
import * as styles from './MasteryCard.module.css';
import { Achievement, type AchievementCategory, type Schema } from '@ribbon-studios/guild-wars-2/v2';
import { MasteryTier, selectMasteryCategory } from '@/store/mastery.slice';
import { useSelector } from 'react-redux';
import { MasteryIcon } from './MasteryIcon';
import type { UseEnhancedAchievements } from '@/hooks/use-enhanced-achievements';

export function MasteryCard({ category, achievements, children, className }: MasteryCard.Props) {
  const masteryTier = useSelector(selectMasteryCategory(category.id));

  const current = useMemo(
    () => achievements?.reduce((output, achievement) => (achievement.done ? output + 1 : output), 0),
    [achievements]
  );

  const markers = useMemo<ProgressBar.Marker[]>(() => {
    const metas = achievements?.filter(({ flags }) => flags.includes(Achievement.Flags.CATEGORY_DISPLAY)) ?? [];

    return metas.map((achievement) => ({
      value: achievement.tier.count,
      label: achievement.name,
    }));
  }, [achievements]);

  return (
    <TuiCard
      className={cn(styles.masteryCard, className)}
      icon={<MasteryIcon masteryTier={masteryTier} size={64} />}
      splash={{
        image: category.icon,
        grayscale: masteryTier !== MasteryTier.TRUE,
      }}
    >
      <div className="flex flex-1 gap-1 items-center justify-between">
        <div className="flex gap-2 items-center text-lg font-bold">True Mastery</div>
        {children && <div className="flex gap-4 items-center">{children}</div>}
      </div>
      <ProgressBar current={current} max={achievements?.length} markers={markers} />
    </TuiCard>
  );
}

export namespace MasteryCard {
  export type Props = {
    category: AchievementCategory<Schema.LATEST>;
    achievements?: UseEnhancedAchievements.Achievement[];
    children?: ReactNode;
    className?: string;
  };
}
