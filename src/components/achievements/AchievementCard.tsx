import { cn } from '@/utils/cn';
import { ProgressBar } from '../common/ProgressBar';
import type { CategoryAchievement } from '@/service/api';
import { Card } from '../common/Card';
import * as styles from './AchievementCard.module.css';
import React from 'react';
import { AchievementActions } from './AchievementActions';

export function AchievementCard({ achievement, className }: AchievementCard.Props) {
  return (
    <Card
      className={cn(styles.achievementCard, achievement.meta && styles.meta, className)}
      icon={achievement.icon}
      splash={{
        icon: achievement.icon,
        grayscale: !achievement.done,
      }}
    >
      <div className={styles.content}>
        <div className="flex justify-between">
          <div className="font-bold">{achievement.name}</div>
          <AchievementActions achievement={achievement} />
        </div>
        <div className={styles.info}>
          <div className="text-sm text-white/80">{achievement.description}</div>
          {!achievement.done && (
            <>
              {achievement.progress && (
                <>
                  {achievement.progress.current} / {achievement.progress.max}
                  <ProgressBar current={achievement.progress.current} max={achievement.progress.max} />
                </>
              )}

              {achievement.prerequisites && (
                <div className="flex flex-col gap-1 italic text-sm text-white/60">
                  <div>Prerequisites:</div>
                  {achievement.prerequisites.map((prerequisite) => (
                    <React.Fragment key={prerequisite.id}>{prerequisite.name}</React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

export namespace AchievementCard {
  export type Props = {
    achievement: CategoryAchievement;
    className?: string;
  };
}
