import { ProgressBar } from '@/components/common/ProgressBar';
import { Card } from '@/components/common/Card';
import { cn } from '@/utils/cn';
import { useEffect, useMemo, type FC, type ReactNode } from 'react';
import type { CategoryAchievement } from '@/service/api';
import * as styles from './TrueMasteryCard.module.css';
import { TuiIcon } from '../common/TuiIcon';
import type { AchievementCategory, Schema } from '@ribbon-studios/guild-wars-2/v2';
import { useAppDispatch } from '@/store';
import { setTrueMastery } from '@/store/true-mastery.slice';

export const TrueMasteryCard: FC<TrueMasteryCard.Props> = ({ category, achievements, children, className }) => {
  const dispatch = useAppDispatch();
  const current = useMemo(
    () => achievements?.reduce((output, achievement) => (achievement.done ? output + 1 : output), 0),
    [achievements]
  );

  const isDone = useMemo<boolean>(() => {
    if (!achievements || !current) return false;

    return current >= achievements.length;
  }, [achievements, current]);

  useEffect(() => {
    if (!isDone) return;

    dispatch(setTrueMastery(category.id));
  }, [isDone]);

  return (
    <Card
      className={cn(styles.trueMasteryCard, className)}
      splash={{
        image: category.icon,
        grayscale: !isDone,
      }}
    >
      <div className="flex flex-1 gap-1 items-center justify-between">
        <div className="flex gap-2 items-center text-lg font-bold">
          {isDone && (
            <TuiIcon
              icon="https://render.guildwars2.com/file/5A4E663071250EC72668C09E3C082E595A380BF7/528724.png"
              size={36}
            />
          )}
          True Mastery
        </div>
        {children && <div className="flex gap-4 items-center">{children}</div>}
      </div>
      <ProgressBar current={current} max={achievements?.length} />
    </Card>
  );
};

export namespace TrueMasteryCard {
  export type Props = {
    category: AchievementCategory<Schema.LATEST>;
    achievements?: CategoryAchievement[];
    children?: ReactNode;
    className?: string;
  };
}
