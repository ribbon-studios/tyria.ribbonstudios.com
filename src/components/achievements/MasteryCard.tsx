import { ProgressBar } from '@/components/common/ProgressBar';
import { Card } from '@/components/common/Card';
import { cn } from '@/utils/cn';
import { useMemo, type ReactNode } from 'react';
import type { CategoryAchievement } from '@/service/api';
import * as styles from './MasteryCard.module.css';
import type { AchievementCategory, Schema } from '@ribbon-studios/guild-wars-2/v2';
import { MasteryTier, selectMasteryCategory } from '@/store/mastery.slice';
import { useSelector } from 'react-redux';
import { MasteryIcon } from './MasteryIcon';

export function MasteryCard({ category, achievements, children, className }: MasteryCard.Props) {
  const masteryTier = useSelector(selectMasteryCategory(category.id));

  const current = useMemo(
    () => achievements?.reduce((output, achievement) => (achievement.done ? output + 1 : output), 0),
    [achievements]
  );

  return (
    <Card
      className={cn(styles.nasteryCard, className)}
      splash={{
        image: category.icon,
        grayscale: masteryTier !== MasteryTier.TRUE,
      }}
    >
      <div className="flex flex-1 gap-1 items-center justify-between">
        <div className="flex gap-2 items-center text-lg font-bold">
          <MasteryIcon masteryTier={masteryTier} />
          True Mastery
        </div>
        {children && <div className="flex gap-4 items-center">{children}</div>}
      </div>
      <ProgressBar current={current} max={achievements?.length} />
    </Card>
  );
}

export namespace MasteryCard {
  export type Props = {
    category: AchievementCategory<Schema.LATEST>;
    achievements?: CategoryAchievement[];
    children?: ReactNode;
    className?: string;
  };
}
